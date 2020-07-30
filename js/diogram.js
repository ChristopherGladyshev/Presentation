class Donut {
	constructor(selector, data, duration) {
		this.duration = duration;
		this.el = 500;

		this.height = this.el;
		this.width = this.el;
		this.radius = Math.min(this.width, this.height) / 2;

		this.svg = d3.select(selector)
			.append('svg')
			.attr('width', this.width)
			.attr('height', this.height)
			.append('g')
			.attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);

		this.svg.append('g').attr('class', 'slices');
		this.svg.append('g').attr('class', 'labels');
		this.svg.append('g').attr('class', 'lines');

		this.arc = d3.arc()
			.innerRadius(this.radius * .5)
			.outerRadius(this.radius * .6)
			.padAngle(.05);

		this.outerArc = d3.arc()
			.innerRadius(this.radius * .7)
			.outerRadius(this.radius * .7);

		this.textArc = d3.arc()
			.innerRadius(this.radius * .8)
			.outerRadius(this.radius * .8);

		this.donut = d3.pie()
			.sort(null)
			.value((d) => d.value);

		this.color = d3.scaleOrdinal()
			.domain(['stick', 'band', 'interest'])
			.range(['darkred', 'gray', 'indianred']);

		this.change(data);
	}

	change(data) {
		this.data = this.donut(data);

		this.drawLines();
		this.drawSlices();
		this.drawText();
	}

	drawLines() {
		let { arc, data, duration, outerArc, svg } = this;

		let polyline = svg.select('.lines')
			.selectAll('polyline')
			.data(data, (d) => d.data.label);

		polyline.enter()
			.append('polyline')
			.attr('fill', 'none')
			.attr('opacity', (d) => (d.value) ? .25 : 0)
			.attr('points', function (d) {
				return [
					...arc.centroid(d),
					...outerArc.centroid(d)
				];
			})
			.attr('stroke', 'black')
			.attr('stroke-width', '1px');

		polyline.transition()
			.duration(duration)
			.attrTween('points', function (d) {
				return d3.interpolateArray(
					this.getAttribute('points').split(','),
					[...arc.centroid(d), ...outerArc.centroid(d)]
				);
			})
			.attrTween('opacity', function (d) {
				return d3.interpolate(this.getAttribute('opacity'), (d.value) ? .25 : 0)
			});

		polyline.exit().remove();
	}

	drawSlices() {
		let { arc, data, duration, color, svg } = this;

		let slice = svg.select('.slices')
			.selectAll('.slice')
			.data(data, (d) => d.data.label);

		slice.enter()
			.append('path')
			.attr('class', 'slice')
			.attr('d', arc)
			.attr('endAngle', (d) => d.endAngle)
			.attr('fill', (d) => color(d.data.type))
			.attr('opacity', (d) => (d.value) ? 1 : 0)
			.attr('startAngle', (d) => d.startAngle);

		slice.transition()
			.duration(duration)
			.attrTween('d', function (d) {
				let interpolate = d3.interpolateObject({
					startAngle: this.getAttribute('startAngle'),
					endAngle: this.getAttribute('endAngle')
				}, d);

				return function (t) {
					return arc(interpolate(t));
				};
			})
			.attrTween('opacity', function (d) {
				return d3.interpolate(this.getAttribute('opacity'), (d.value) ? 1 : 0)
			})
			.attr('startAngle', (d) => d.startAngle)
			.attr('endAngle', (d) => d.endAngle);

		slice.exit().remove();
	}

	drawText() {
		let { color, data, duration, svg, textArc } = this;

		let text = svg.select('.labels')
			.selectAll('text')
			.data(data, (d) => d.data.label);

		text.enter()
			.append('text')
			.attr('dx', (d) => textArc.centroid(d)[0])
			.attr('dy', (d) => textArc.centroid(d)[1])
			.attr('fill', (d) => color(d.data.type))
			.attr('opacity', (d) => (d.value) ? 1 : 0)
			.attr('text-anchor', 'middle')
			.text((d) => `${d.data.label}`);

		text.transition()
			.duration(duration)
			.attrTween('dx', function (d) {
				return d3.interpolate(this.getAttribute('dx'), textArc.centroid(d)[0]);
			})
			.attrTween('dy', function (d) {
				return d3.interpolate(this.getAttribute('dy'), textArc.centroid(d)[1]);
			})
			.attrTween('fill', function (d) {
				return d3.interpolateRgb(this.getAttribute('fill'), color(d.data.type));
			})
			.attrTween('opacity', function (d) {
				return d3.interpolate(this.getAttribute('opacity'), (d.value) ? 1 : 0)
			});

		text.exit().remove();
	}
};

const AnimatedNumber = {
	template: `
		<span>{{ animatedNumber }}</span>
	`,
	props: ['value'],
	data: () => ({
		tweenedValue: 0
	}),
	computed: {
		animatedNumber() {
			return this.tweenedValue.toFixed(0);
		}
	},
	watch: {
		value(newValue) {
			TweenLite.to(this.$data, .5, { tweenedValue: newValue });
		}
	},
	created() {
		this.tweenedValue = this.value;
	}
};

const DonutApp = new Vue({
	components: { AnimatedNumber },
	data: {
		chart: false,
		currentSetIndex: 0,
		data: {
			labels: [
				'Визиты с сайтов', 'Прямые визиты', 'Google',
				'Яндекс', 'CEO', 'B10I',
				'B33', 'CS'
			],
			types: [
				'band', 'band', 'interest',
				'stick', 'stick', 'stick',
				'stick', 'stick'
			],
			values: [
				[0, 132, 175, 235, 1551,],
				[0, 3, 3, 3, 16,],
				[0, 410779, 376400, 43600, 4046950,],
				[0, 0, 86473, 195381, 0,],
				[0, 410779, 289927, -151781, 4046950,]
			]
		}
	},
	computed: {
		currentDataset() {
			return this.datasets[this.currentSetIndex];
		},
		datasets() {
			return this.data.values.map((set) => {
				return set.map((value, index) => {
					return {
						label: this.data.labels[index],
						type: this.data.types[index],
						value: value
					};
				});
			});
		},
		legendItems() {
			return this.currentDataset.filter((item) => item.value);
		},
		percentMakeup() {
			let bands = this.currentDataset.filter((item) => item.type == 'band');
			let interests = this.currentDataset.filter((item) => item.type == 'interest');
			let sticks = this.currentDataset.filter((item) => item.type == 'stick');

			return {
				// bands: bands.reduce((total, current) => {
				// 	return total + current.value;
				// }, 0),
				// interests: interests.reduce((total, current) => {
				// 	return total + current.value;
				// }, 0),
				// sticks: sticks.reduce((total, current) => {
				// 	return total + current.value;
				// }, 0)
			};
		}
	},
	watch: {
		currentDataset(value) {
			this.chart.change(this.currentDataset);
		}
	},
	mounted() {
		this.chart = new Donut('#chart', this.datasets[this.currentSetIndex], 1000);
	}
});
const DonutApp1 = new Vue({
	components: { AnimatedNumber },
	data: {
		chart: false,
		currentSetIndex: 0,
		data: {
			labels: [
				'В с сайтов', 'Яндекс', 'Google','Прямые в.','CEO'
			],
			types: [
				'band', 'band', 'interest',
				'stick', 'stick', 'stick',
				'stick', 'stick', 'stick', 'stick', 'stick', 'stick', 'stick', 'stick'
			],
			values: [
				[6, 42, 29, 8, 121,],
				[11, 43, 28, 13, 140,],
				[4, 49, 28, 27, 329,],
				[5, 48, 31, 23, 303,],
				[0, 12, 25, 21, 250,],
				[0, 37, 32, 39, 452,],
			]
		}
	},
	computed: {
		currentDataset() {
			return this.datasets[this.currentSetIndex];
		},
		datasets() {
			return this.data.values.map((set) => {
				return set.map((value, index) => {
					return {
						label: this.data.labels[index],
						type: this.data.types[index],
						value: value
					};
				});
			});
		},
		legendItems() {
			return this.currentDataset.filter((item) => item.value);
		},
		percentMakeup() {
			let bands = this.currentDataset.filter((item) => item.type == 'band');
			let interests = this.currentDataset.filter((item) => item.type == 'interest');
			let sticks = this.currentDataset.filter((item) => item.type == 'stick');

			return {
				// bands: bands.reduce((total, current) => {
				// 	return total + current.value;
				// }, 0),
				// interests: interests.reduce((total, current) => {
				// 	return total + current.value;
				// }, 0),
				// sticks: sticks.reduce((total, current) => {
				// 	return total + current.value;
				// }, 0)
			};
		}
	},
	watch: {
		currentDataset(value) {
			this.chart.change(this.currentDataset);
		}
	},
	mounted() {
		this.chart = new Donut('#chart1', this.datasets[this.currentSetIndex], 1000);
	}
});


DonutApp.$mount('#donut-app');
DonutApp1.$mount('#donut-app1');
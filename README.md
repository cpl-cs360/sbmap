# sbmap

The comprehensive Small Body Map for the Average Person (SBMAP), aims to provide a digestible, holistic representation of our solar system's many small bodies without sacrificing detail or accuracy.

The front-end tech stack:

- [D3](https://d3js.org)
- [React](https://reactjs.org)
- [Sass](https://sass-lang.com)

Data Processing done using:

- Python (Pandas)
- JavaScript ([Stratify](https://github.com/cpl-cs360/sbmap/blob/main/data/dashboard/Stratify.js))

## Deployment

Find the live deployment at [https://cpl-cs360.github.io/sbmap/](https://cpl-cs360.github.io/sbmap/)

Performance is optimized for Opera and Firefox with resolution higher than 1280x800

![Hexbin hero image](./public/hexbin_hero.png)

## Data-processing

### Hexbins

Due to the intense runtime for calculating orbital ellipses for 1.2 million small bodies, the algorithm takes roughly 75 hours to complete synchronously. By using Python’s [multiprocessing](https://docs.python.org/3/library/multiprocessing.html), I reduced the algorithm runtime by 92% (down to 6 hours). 

Here is a simple pseudocode demonstration of the data processing done in Python. Find the source code [here](https://github.com/cpl-cs360/sbmap/blob/main/data/hexbin/hex_binify.py).

```python
for body in dataset:
	# get all points based on the body's orbital parameter
	points = get_all_points_in_ellipse(body)

	# get all bins based on the points
	bins = get_hex_bins_by_points(points)

	for bin in bins:
		# if this body crossed this bin
		if bin.count > 0:
			# add this id to the set of asteroids that crosssed the hex
			bin.ids += body.id
			
	total_bins += bins

```

### The Dashboard

Due to the sheer size of the dataset, some sort of aggregation had to be done to allow for fast interaction in the dashboard. The dataset started at 140K datapoints but I needed a sample population that was representative in three dimensions: orbit distance, diameter, and orbit eccentricity. My solution resembles some sort of [multivariate stratified sampling](https://en.wikipedia.org/wiki/Stratified_sampling). Below is a simple demonstration of this sampling, you can find the full source code [here](https://github.com/cpl-cs360/sbmap/blob/main/data/dashboard/Stratify.js).

```javascript
let sample = [],
    // we create an i outside of the loops to prevent grabbing the first item in every bin
    i = 0;  

// bin in x direction
let xBins = getBins(x, data);
xBins.forEach(function (xBin) {
    // bin in y direction
    let yBins = getBins(y, xBin.values);
    yBins.forEach(function (yBin) {
        // bin in z direction
        let zBins = getBins(z, yBin.values)
        zBins.forEach(function (zBin) {
            // shuffle the points to ensure randomness
            let shuffled = d3.shuffle(zBin.values)
            for(let d of shuffled) {
                if(i % 14 === 0) {
                    sample.push(d)
                }
                i += 1;
            }
        })
    })
})

return sample;
```

By binning the data based on one varibale, I group the points into similar groups or strata. I repeat this process within these stratas two more times making groups of very like data points in all three dimensions. I visualized this as slicing a mountain range by x, then by y, then by z. One can see how the data points within the resulting slices will be very similar to each other in all dimensions. I then took 1 in every 14 points from these stratas to produce a sample size of 1/14th the original (resulting in a sample of around 10K data points).
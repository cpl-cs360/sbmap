# sbmap

The comprehensive Small Body Map for the Average Person (SBMAP), aims to provide a digestible, holistic representation of our solar system's many small bodies without sacrificing detail or accuracy.

The front-end tech stack:

- [D3](https://d3js.org)
- [React](https://reactjs.org)
- [Sass](https://sass-lang.com)

Data Processing done using:

- Python (Pandas)
- JavaScript ([sample-stratify](https://github.com/colmpat/sample-stratify))

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

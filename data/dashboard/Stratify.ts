import * as d3 from 'd3';

// All keys of data that are strings must return a number
type Data = {
    [key: string]: number;
}

// Each bin will have a min value and an array of data points
type Bin = {
    min: number;
    values: Data[];
}

/**
 * Does Multivariate Stratified Sampling to produce a representative sample population in multiple dimensions.
 * @param path string - path to data
 * @param x string - first variable (column header in the form of a string whose contents must be quantitative)
 * @param y string - second variable (column header in the form of a string whose contents must be quantitative)
 * @param z string - third variable (column header in the form of a string whose contents must be quantitative)
 * @param k numer - number of strata in each dimension
 * @param r number - factor of reduction eg. r = 10 will return a data set 1/10th the size of the original
 * @returns a sampled population representative of the original distribution for x, y, and z, r times smaller than the orginal.
 */
export default async function stratify(path: string, x: string, y: string, z: string, k: number, r: number) {
    let data: Data[] = await d3.csv(path, (d: Data) => {
        d[x] = +d[x];
        d[y] = +d[y];
        d[z] = +d[z];
        return d;
    });

    // Because we do ++i below (++i is faster than i++)
    let i = -1;
    let sample: Data[] = [];

    let xBins = getBins(x, data, k);
    xBins.forEach(function (xBin) {
        let yBins = getBins(y, xBin.values, k);
        yBins.forEach(function (yBin) {
            let zBins = getBins(z, yBin.values, k)
            zBins.forEach(function (zBin) {
                let shuffled: Data[] = d3.shuffle(zBin.values)
                for(let d of shuffled) {
                    if(++i % r === 0) sample.push(d)
                }
            })
        })
    })
    
    return sample;
}

function getBins(variable: string, data: Data[], k: number) {
    // sort by variable
    data.sort((a,b) => a[variable] < b[variable] ? -1 : 1)

    let [min, max] = d3.extent(data.map(d => d[variable])) as [number, number]
    let binWidth = (max - min) / k
    let bins: Bin[] = [...Array(k)].map((_, i) => {
        return { min: binWidth * i + min, values: [] }
    });

    let b = 0;
    data.forEach(d => {
        if(b < k - 1 && d[variable] >= bins[b + 1].min) b++;
        bins[b].values.push(d);
    })
    return bins;
}

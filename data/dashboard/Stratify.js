import * as d3 from 'd3';

/**
 * Does Multivariate Stratified Sampling to produce a representative sample population in multiple dimensions.
 * @param path String - path to data
 * @param x String - first variable (column header in the form of a string whose contents must be quantitative)
 * @param y String - second variable (column header in the form of a string whose contents must be quantitative)
 * @param z String - third variable (column header in the form of a string whose contents must be quantitative)
 * @param k Int - number of strata in each dimension
 * @param r Int - factor of reduction eg. r = 10 will return a data set 1/10th the size of the original
 * @returns a sampled population representative of the original distribution for x, y?, and z?, r times smaller than the orginal.
 */
export default async function stratify(path, x, y, z, k, r) {
    let data = await d3.csv(path, d => {
        d[x] = +d[x];
        d[y] = +d[y];
        d[z] = +d[z];
        return d;
    });

    let zData = {
        sum: 0,
        count: 0,
        max: 0
    }
    let i = 0;
    let sample = [];

    let xBins = getBins(x, data);
    xBins.forEach(function (xBin) {
        let yBins = getBins(y, xBin.values);
        yBins.forEach(function (yBin) {
            let zBins = getBins(z, yBin.values)
            zBins.forEach(function (zBin) {
                let l = zBin.values.length
                zData.sum += l;
                zData.count += 1;
                if(l > zData.max) zData.max = l;

                let shuffled = d3.shuffle(zBin.values)
                for(let d of shuffled) {
                    if(i % r === 0) {
                        sample.push(d)
                    }
                    i += 1;
                }
            })
        })
    })
    
    return sample;

    function getBins(variable, data) {
        // sort by variable
        data.sort((a,b) => a[variable] < b[variable] ? -1 : 1)

        let extent = d3.extent(data.map(d => d[variable]))
        let binWidth = (extent[1] - extent[0]) / k
        let bins = [...Array(k)].map((_, i) => {
            return {min: binWidth * i + extent[0], values:[]}
        });

        let b = 0;
        data.forEach(d => {
            if(b < k - 1 && d[variable] >= bins[b + 1].min) b++;
            bins[b].values.push(d);
        })
        return bins;
    }
    
}

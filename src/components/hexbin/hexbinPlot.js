import * as d3 from 'd3';

export const hexbinPlot = () => {
    let hexData,
        orbitData,
        dimensions; 

    const my = (selection) => {

    }

    my.hexData = function(_) {
        return arguments.length ? (hexData = _, my) : hexData;
    }
    my.orbitData = function(_) {
        return arguments.length ? (orbitData = _, my) : orbitData;
    }
    my.dimensions = function(_) {
        return arguments.length ? (dimensions = _, my) : dimensions;
    }

    return my;
}
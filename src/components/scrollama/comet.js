import * as d3 from 'd3'

export const comet = () => {
    let view,
        dimensions;
        // basemapJSON,
        // streetsJSON;

    const my = (selection) => {
        const { w, h, margin } = dimensions;

        const halley = {
            id: '1P/Halley',
            a: 17.8341442925537,
            e: 0.967142908462304,
            w: 111.3324851045177,
            I: 162.262690579161,
        }

        // data approximations from https://ssd.jpl.nasa.gov/planets/approx_pos.html
        const planets = [
            // {
            //     id: 'mercury',
            //     a: 0.38709927,
            //     e: 0.20563593,
            //     I: 7.00497902,
            //     w: 77.45779628
            // },
            // {
            //     id: 'venus',
            //     a: 0.72333566,
            //     e: 0.00677672,
            //     I: 3.39467605,
            //     w: 131.60246718
            // },
            {
                id: 'earth',
                a: 1.00000261,
                e: 0.01671123,
                I: 360 - 0.00001531,
                w: 102.93768193
            },
            {
                id: 'mars',
                a: 1.52371034,
                e: 0.09339410,
                I: 1.84969142,
                w: 360 - 23.94362959
            },
            {
                id: 'jupiter',
                a: 5.20288700,
                e: 0.04838624,
                I: 1.30439695,
                w: 14.72847983
            },
            {
                id: 'saturn',
                a: 9.53667594,
                e: 0.05386179,
                I: 2.48599187,
                w: 92.59887831
            },
            {
                id: 'uranus',
                a: 19.18916464,
                e: 0.04725744,
                I: 0.77263783,
                w: 170.95427630
            },
            {
                id: 'neptune',
                a: 30.06992276,
                e: 0.00859048,
                I: 1.77004347,
                w: 44.96476227
            }
        ]

        const getC = ({a,e}) => {
            let b = a * Math.sqrt(1 - (e * e))
            return Math.sqrt((a * a) - (b * b))
        }

        const getB = ({a, e}) => a * Math.sqrt(1 - (e * e))

        const x = d3.scaleLinear()
        .range([0, w < h ? w / 2 : h / 2])


        const t = d3.transition()
        .duration(500)
        
        const fastT = d3.transition()
        .duration(300)
        
        const birdsEyeView = () => {
            x.domain([0, d3.max(planets, w < h ? d => d.a : getB)])

            selection.selectAll('.sun')
            .data([null])
            .join('circle')
            .attr('class', 'sun')
            .attr('cx', w/2)
            .attr('cy', h/2)
            .transition(t)
            .attr('r', 3)

            const positionOrbits = orbits => {
                orbits
                .attr('cx', d => x(-1 * getC(d)))
                .attr('cy', x(0))
                
            }
            const setOrbitSize = orbits => {
                orbits
                .attr('rx', d => x(d.a))
                .attr('ry', d => x(getB(d)))
            }
            const initializeSize = orbits => {
                orbits
                .attr('rx', 0)
                .attr('ry', 0)
            }
            const setOrbitRotation = orbits => {
                orbits.attr('transform', d => `rotate(-${d.w} 0 0)`)
            }

            let g = selection.selectAll('g')
            .data([null])
            .join('g')
            .attr('transform', `translate(${w / 2},${h/2})`)
    
            g.selectAll('.orbit')
            .data(planets)
            .join(
                (enter) =>
                    enter
                    .append('ellipse')
                    .attr('class', d => 'orbit ' + d.id)
                    .attr('stroke', '#eee')
                    .attr('stroke-width', 2)
                    .attr('fill', 'none')
                    .call(positionOrbits)
                    .call(initializeSize)
                    .call(setOrbitRotation)
                    .transition(t)
                    .call(setOrbitSize),
                (update) =>
                    update.call(update =>
                        update
                        .transition(t)
                        .call(positionOrbits)
                        .call(setOrbitSize)
                        .transition(fastT)
                        .call(setOrbitRotation)
                    ),
                exit => 
                    exit
                    .transition(t)
                    .call(initializeSize)
                    .remove()
            )
            g.selectAll('.comet')
            .data([halley])
            .join(
                (enter) =>
                    enter
                    .append('ellipse')
                    .attr('class', 'comet')
                    .attr('stroke', 'green')
                    .attr('stroke-width', 2)
                    .attr('fill', 'none')
                    .call(positionOrbits)
                    .call(initializeSize)
                    .call(setOrbitRotation)
                    .transition(t)
                    .call(setOrbitSize),
                (update) =>
                    update.call(update =>
                        update
                        .transition(t)
                        .call(positionOrbits)
                        .call(setOrbitSize)
                        .transition(fastT)
                        .call(setOrbitRotation)
                    ),
                exit => 
                    exit
                    .transition(t)
                    .call(initializeSize)
                    .remove()
            )
            .raise()
        }

        const sideView = () => {
            x.domain([0, d3.max(planets, d => d.a)])
            const positionOrbits = orbits => {
                orbits
                .attr('cx', d => x(-1 * getC(d)))
                .attr('cy', x(0))
            }
            const setOrbitSize = orbits => {
                orbits
                .attr('rx', d => x(d.a))
                .attr('ry', 0.001)
            }
            const setOrbitRotation = orbits => {
                orbits.attr('transform', d => `rotate(-${d.I} 0 0)`)
            }
            const initializeSize = orbits => {
                orbits
                .attr('rx', 0)
                .attr('ry', 0)
            }

            let g = selection.selectAll('g')
            .data([null])
            .join('g')
    
            g.selectAll('.orbit')
            .data(planets)
            .join(
                (enter) =>
                    enter
                    .append('ellipse')
                    .attr('class', d => 'orbit ' + d.id)
                    .call(positionOrbits)
                    .call(initializeSize)
                    .transition(t)
                    .call(setOrbitSize),
                (update) =>
                    update.call(update =>
                        update
                        .transition(t)
                        .call(setOrbitRotation)
                        .transition(fastT)
                        .call(positionOrbits)
                        .call(setOrbitSize)
                    ),
                exit => 
                    exit
                    .transition(t)
                    .call(initializeSize)
                    .remove()
            )
            .raise()

            g.selectAll('.comet')
            .data([halley])
            .join(
                (enter) =>
                    enter
                    .append('ellipse')
                    .attr('class', d => 'orbit ' + d.id)
                    .call(positionOrbits)
                    .call(setOrbitRotation)
                    .call(initializeSize)
                    .transition(t)
                    .call(setOrbitSize),
                (update) =>
                    update.call(update =>
                        update
                        .transition(t)
                        .call(setOrbitRotation)
                        .transition(fastT)
                        .call(positionOrbits)
                        .call(setOrbitSize)
                    ),
                exit => 
                    exit
                    .transition(t)
                    .call(initializeSize)
                    .remove()
            )
        }

        // const sizeView = () => {

        //     // SF BASEMAP AND STREETS THANKS TO SOPHIE ENGLE'S VIZHUB PROJECT HERE https://vizhub.com/sjengle/ddee531e7a414d97a059d751507e0f41
        //     const g = {
        //         basemap: selection
        //             .selectAll("g#basemap")
        //             .data([null])
        //             .join('g')
        //             .attr('id','basemap'),
        //         streets: selection
        //             .selectAll("g#streets")
        //             .data([null])
        //             .join('g')
        //             .attr('id','streets'),
        //       };

        //     const projection = d3.geoConicEqualArea();
        //     projection.parallels([37.692514, 37.840699]);
        //     projection.rotate([122, 0]);

        //     const path = d3.geoPath().projection(projection);

        //     // makes sure to adjust projection to fit all of our regions
        //     projection.fitSize([960, 600], basemapJSON);
              
        //     // draw the land and neighborhood outlines
        //     drawBasemap(basemapJSON);
        //     drawStreets(streetsJSON);

        //       function drawBasemap(json) {
        //         console.log("basemap", json);
              
        //         const basemap = g.basemap.selectAll("path.land")
        //           .data(json.features)
        //           .enter()
        //           .append("path")
        //           .attr("class", "land")
        //           .attr("d", path)
        //           .attr('fill', 'red')
              
        //       }

        //     function drawStreets(json) {
        //       console.log("streets", json);
            
        //       // only show active streets
        //       const streets = json.features.filter(function(d) {
        //         return d.properties.active;
        //       });
            
        //       console.log("removed", json.features.length - streets.length, "inactive streets");
            
        //       g.streets.selectAll("path.street")
        //         .data(streets)
        //         .enter()
        //         .append("path")
        //         .attr("d", path)
        //         .attr("class", "street");
        //     }

        // }

        const views = {
            'above': birdsEyeView, 
            'side': sideView,
            // 'size': sizeView,
        }
        views[view] && views[view]()
    }

    my.view = function (_) {
        return arguments.length ? (view = _, my) : view;
    }
    my.dimensions = function (_) {
        return arguments.length ? (dimensions = _, my) : dimensions;
    }
    // my.basemapJSON = function (_) {
    //     return arguments.length ? (basemapJSON = _, my) : basemapJSON;
    // }
    // my.streetsJSON = function (_) {
    //     return arguments.length ? (streetsJSON = _, my) : streetsJSON;
    // }

    return my;
}
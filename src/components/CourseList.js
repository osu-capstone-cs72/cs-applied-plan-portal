export let courses = [
    {
        code: "CS 450",
        title: "Introduction to Computer Graphics",
        hours: 4,
        description: "2-D and 3-D graphics API's Modeling transformations. Viewing specification \
        and transformations. Projections. Shading. Texture mapping. Traditional animation concepts. \
        3-D production pipeline. Keyframing and kinematics. Procedural animation.",
        prereqs: "CS 261 with C or better and (MTH 306 [C] or MTH 306H [C] or MTH 341 [C])"
    },
    {
        code: "CS 453",
        title: "Scientific Visualization",
        hours: 4,
        description: "Applies 3D computer graphics methods to visually understand scientific and \
        engineering data. Methods include hyperbolic projections; mapping scalar values to color spaces; \
        data visualization using range sliders; scalar visualization (point clouds, cutting planes, contour plots,\
        isosurfaces); vector visualization (arrow clouds, particle advection, streamlines); terrain \
        visualization; Delauney triangulation; and volume visualization.",
        prereqs: "Prior experience with Unix or Windows, programming experience. (Recommended)"
    },
    {
        code: "CS 457",
        title: "Computer Graphics Shaders",
        hours: 4,
        description: "Theoretical and practical treatment of computer graphics shaders, including both RenderMan \
        and GPU shaders. Programming in both RenderMan and OpenGL shading languages.",
        prereqs: "Previous graphics pipeline programming experience. (Recommended)"
    }
];

export default courses;

export let courses = [
    {
        code: "CS 261",
        title: "Data Structures",
        credits: 4,
        description: `Abstract data types, dynamic arrays, linked lists, trees and graphs,
        binary search trees, hash tables, storage management, complexity analysis of data structures.
        Lec/rec.`,
        prereqs: "(CS 162 with C or better or CS 165 with C or better) and (CS 225 [C] or MTH 231 [C])"
    },
    {
        code: "CS 262",
        title: "Programming Projects in C++",
        credits: 4,
        description: `Learning a second computer programming language. Elements of C++. Object-oriented
        programming. Experience team work on a large programming project.`,
        prereqs: "CS 261 with C or better"
    },
    {
        code: "CS 271",
        title: "Computer Architecture and Assembly Language",
        credits: 4,
        description: `Introduction to functional organization and operation of digital computers. 
        Coverage of assembly language; addressing, stacks, argument passing, arithmetic operations,
        decisions, macros, modularization, linkers and debuggers.`,
        prereqs: `CS 151 with C or better or CS 161 with C or better or CS 165 with C or better or 
        ECE 151 with C or better`
    },
    {
        code: "CS 290",
        title: "Web Development",
        credits: 4,
        description: `How to design and implement a multi-tier application using web technologies:
        Creation of extensive custom client- and server-side code, consistent with achieving a high-quality 
        software architecture.`,
        prereqs: "CS 162 with C or better or CS 165 with C or better"
    },
    {
        code: "CS 295",
        title: "Website Management",
        credits: 4,
        description: `How to create and promote a dynamic website using existing frameworks/libraries: 
        Designing, developing, publishing, maintaining, and marketing dynamic websites; web security and 
        privacy issues; emerging web technologies; running a website marketing campaign.`,
        prereqs: "CS 195 with C or better (Recommended: Basic HTML and CSS)"
    },
    {
        code: "CS 312",
        title: "System Administration",
        credits: 4,
        description: `Introduction to system administration. Network administration and routing. Security 
        issues. Computer, server, and network hardware. Lec/lab.`,
        prereqs: "(CS 311 with C or better or CS 344 with C or better) and CS 372 [C]"
    },
    {
        code: "CS 321",
        title: "Theory of Computation",
        credits: 3,
        description: `Survey of models of computation including finite automata, formal grammars, and Turing machines.`,
        prereqs: "CS 261 with C or better and (CS 225 [C] or MTH 231 [C])"
    },
    {
        code: "CS 325",
        title: "Analysis of Algorithms",
        credits: 4,
        description: "Recurrence relations, combinatorics, recursive algorithms, proofs of correctness.",
        prereqs: "CS 261 with C or better and (CS 225 [C] or MTH 231 [C])"
    },
    {
        code: "CS 331",
        title: "Introduction to Artificial Intelligence",
        credits: 4,
        description: `Fundamental concepts in artificial intelligence using the unifying theme of an intelligent 
        agent. Topics include agent architectures, search, games, logic and reasoning, and Bayesian networks.`,
        prereqs: "CS 325 with C or better or CS 325H with C or better"
    },
    {
        code: "CS 340",
        title: "Introduction to Databases",
        credits: 4,
        description: `Design and implementation of relational databases, including data modeling with ER or UML, 
        diagrams, relational schema, SQL queries, relational algebra, user interfaces, and administration.`,
        prereqs: "CS 290 with C or better"
    },
    {
        code: "CS 344",
        title: "Operating Systems I",
        credits: 4,
        description: `Introduction to operating systems using UNIX as the case study. System calls and utilities, 
        fundamentals of processes and interprocess communication.`,
        prereqs: `CS 261 with C or better and (CS 271 [C] or ECE 271 [C]) (Recommended: Experience programming 
        in the C language)`
    },
    {
        code: "CS 352",
        title: "Introduction to Usability Engineering",
        credits: 4,
        description: `Basic principles of usability engineering methods for the design and evaluation of software 
        systems. Includes the study of human-machine interactions, user interface characteristics and design 
        strategies, software evaluation methods, and related guidelines and standards.`,
        prereqs: `CS 151 with C or better or CS 161 with C or better or CS 165 with C or better or CS 295 with C 
        or better or ECE 151 with C or better`
    },
    {
        code: "CS 361",
        title: "Software Engineering I",
        credits: 4,
        description: `Introduction to the "front end" of the software engineering lifecycle; requirements analysis 
        and specification; design techniques; project management.`,
        prereqs: "CS 261 with C or better"
    },
    {
        code: "CS 362",
        title: "Software Engineering II",
        credits: 4,
        description: `Introduction to the "back end" of the software engineering lifecycle implementation; 
        verification and validation; debugging; maintenance.`,
        prereqs: `CS 261 with C or better (Recommended:  Experience with object-oriented programming and data 
        structures (eg. CS 161, CS 162, CS 361))`
    },
    {
        code: "CS 370",
        title: "Introduction to Security",
        credits: 4,
        description: `Introductory course on computer security with the objective to introduce concepts and 
        principles of computer systems security. Notions of security, basic crytographic primitives and their 
        application, basics of authentication and access control, basics of key-management, basics of malware 
        and software security.`,
        prereqs: "CS 344 (may be taken concurrently) with C or better"
    },
    {
        code: "CS 450",
        title: "Introduction to Computer Graphics",
        credits: 4,
        description: `2-D and 3-D graphics API's Modeling transformations. Viewing specification 
        and transformations. Projections. Shading. Texture mapping. Traditional animation concepts. 
        3-D production pipeline. Keyframing and kinematics. Procedural animation.`,
        prereqs: "CS 261 with C or better and (MTH 306 [C] or MTH 306H [C] or MTH 341 [C])"
    },
    {
        code: "CS 453",
        title: "Scientific Visualization",
        credits: 4,
        description: `Applies 3D computer graphics methods to visually understand scientific and 
        engineering data. Methods include hyperbolic projections; mapping scalar values to color spaces; 
        data visualization using range sliders; scalar visualization (point clouds, cutting planes, contour plots,
        isosurfaces); vector visualization (arrow clouds, particle advection, streamlines); terrain 
        visualization; Delauney triangulation; and volume visualization.`,
        prereqs: "Prior experience with Unix or Windows, programming experience. (Recommended)"
    },
    {
        code: "CS 457",
        title: "Computer Graphics Shaders",
        credits: 4,
        description: `Theoretical and practical treatment of computer graphics shaders, including both RenderMan 
        and GPU shaders. Programming in both RenderMan and OpenGL shading languages.`,
        prereqs: "Previous graphics pipeline programming experience. (Recommended)"
    },
    {
        code: "ECE 111",
        title: "Introduction to ECE: Tools",
        credits: 3,
        description: `Introduction to the electrical and computer engineering professional practice. 
        Covers the foundations of engineering problem solving and other skills necessary for success. 
        Students will be taught engineering practice through hands-on approaches. Recommended for electrical 
        and computer engineering majors, and for those interested in engineering as a profession. Lec/lab. 
        Has extra fees.`,
        prereqs: "(Recommended: Completion or concurrent enrollment in MTH 111)"
    },
    {
        code: "ECE 112",
        title: "Introduction to ECE: Concepts",
        credits: 3,
        description: `Basic electrical and computer engineering concepts, problem solving and hands-on 
        laboratory project. Topics include electronic circuit and device models, digital logic, circuit analysis, 
        and simulation tools. Lec/lab. Has extra fees.`,
        prereqs: `MTH 111 with C or better or MTH 112 with C or better or MTH 251 with C or better or MTH 251H 
        with C or better or Math Placement Test with a score of 23`
    },
    {
        code: "ECE 271",
        title: "Digital Logic Design Laboratory",
        credits: 1,
        description: `This laboratory course accompanies ECE 271, Digital Logic Design. This also illustrates 
        topics covered in the lectures of ECE 271 using computer-aided design, verification tools, and prototyping 
        hardware.`,
        prereqs: "(Recommended: Completion or concurrent enrollment in ECE 271)"
    },
    {
        code: "ECE 322",
        title: "Electronics I",
        credits: 3,
        description: `Fundamental device characteristics including diodes, MOSFETs and bipolar transistors; 
        small- and large-signal characteristics and design of linear circuits.`,
        prereqs: "ENGR 203 with C or better"
    },
    {
        code: "ECE 323",
        title: "Electronics II",
        credits: 3,
        description: `Transient operation of MOSFETs and bipolar transistors; multistage amplifiers; 
        frequency response; feedback and stability.`,
        prereqs: "ECE 322 with C or better"
    },
    {
        code: "ECE 331",
        title: "Electromechanical Energy Conversion",
        credits: 4,
        description: `Energy conversion principles for electric machines. Steady state characteristics 
        of direct current, induction, and synchronous machines. Application of stepper and servo motors 
        and synchronous generators.`,
        prereqs: "(ENGR 202 with C or better or ENGR 202H with C or better) and MTH 256 [C] and PH 213 [C]"
    },
    {
        code: "ECE 332",
        title: "Laboratory on Electromechanical Energy Conversion",
        credits: 1,
        description: "DC, PMAC, and induction machine testing, operation, and control.",
        prereqs: "ENGR 202 with C or better or ENGR 202H with C or better"
    },
    {
        code: "ECE 341",
        title: "Junior Design I",
        credits: 3,
        description: `Introduction to system design and group projects. Design and fabrication of an 
        electrical engineering project in a small group.`,
        prereqs: "CS 261 (may be taken concurrently) with C or better and ENGR 203 [C]"
    },
    {
        code: "ECE 342",
        title: "Junior Design II",
        credits: 3,
        description: `Introduction to system design and group projects. Design and fabrication of an 
        electrical engineering project in a small group.`,
        prereqs: "ECE 341 with C or better"
    },
    {
        code: "ECE 351",
        title: "Signals and Systems I",
        credits: 3,
        description: `Analytical techniques for continuous-time and discrete-time signal, system, and 
        circuit analysis. Lec.`,
        prereqs: "ENGR 203 with C or better and (MTH 256 [C] or MTH 256H [C])"
    }
];

export default courses;

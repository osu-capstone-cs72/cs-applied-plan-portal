-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 10, 2020 at 08:38 PM
-- Server version: 8.0.19
-- PHP Version: 7.2.24-0ubuntu0.18.04.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `testdatabase_osu`
--

-- --------------------------------------------------------

--
-- Table structure for table `Comment`
--

CREATE TABLE `Comment` (
  `commentId` int NOT NULL,
  `planId` int NOT NULL,
  `userId` int NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `text` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Comment`
--

INSERT INTO `Comment` (`commentId`, `planId`, `userId`, `text`) VALUES
(1, 308, 1, 'This is my plan.'),
(2, 308, 9, 'This plan looks good!'),
(6, 310, 5, 'I sure do love my plan.'),
(7, 310, 2, 'I don\'t like this plan. Lets get rid of it.'),
(9, 310, 6, 'Sure, plan rejected.'),
(33, 308, 1, 'Test Comment.'),
(34, 308, 1, 'This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...'),
(35, 308, 1, 'This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...'),
(36, 308, 1, 'This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...'),
(37, 308, 1, 'This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message...This is a really long message............................................................................................................................................................................'),
(38, 308, 1, 'testtttttttttttttttttttttttttttttttttttttttttttttttt');

-- --------------------------------------------------------

--
-- Table structure for table `Course`
--

CREATE TABLE `Course` (
  `courseId` int NOT NULL,
  `credits` int NOT NULL,
  `courseName` varchar(100) NOT NULL,
  `courseCode` varchar(8) NOT NULL,
  `restriction` int NOT NULL,
  `description` varchar(1000) NOT NULL,
  `prerequisites` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Course`
--

INSERT INTO `Course` (`courseId`, `credits`, `courseName`, `courseCode`, `restriction`, `description`, `prerequisites`) VALUES
(1, 4, 'Computers: Applications and Implications', 'CS101', 0, 'The varieties of computer hardware and software. The effects, positive and negative, of computers on human lives. Ethical implications of information technology. Hands-on experience with a variety of computer applications. Lec/lab.', ''),
(2, 4, 'Data Structures', 'CS261', 1, 'Abstract data types, dynamic arrays, linked lists, trees and graphs, binary search trees, hash tables, storage management, complexity analysis of data structures. Lec/rec.', ''),
(3, 4, 'Computer Architecture and Assembly Language', 'CS271', 1, 'Introduction to functional organization and operation of digital computers. Coverage of assembly language; addressing, stacks, argument passing, arithmetic operations, decisions, macros, modularization, linkers and debuggers.', ''),
(4, 4, 'Web Development', 'CS290', 1, 'How to design and implement a multi-tier application using web technologies: Creation of extensive custom client- and server-side code, consistent with achieving a high-quality software architecture.', ''),
(5, 3, 'Introduction to Theory of Computation', 'CS321', 0, 'Survey of models of computation including finite automata, formal grammars, and Turing machines.', 'CS 261 and (CS 225 or MTH 231).\r\nA minimum grade of C is required in CS 261, CS 225 and MTH 231.\r\n\r\nStudents cannot enroll who have a program in Computer Science Double Degree (297).\r\n\r\nEnrollment limited to students in the College of Engineering college.'),
(6, 3, 'Social and Ethical Issues in Computer Science', 'CS391', 1, 'In-depth exploration of the social, psychological, political, and ethical issues surrounding the computer industry and the evolving information society. (Bacc Core Course)', 'CS 101 or computer literacy.'),
(7, 4, 'Introduction to Parallel Programming', 'CS475', 0, 'Theoretical and practical survey of parallel programming, including a discussion of parallel architectures, parallel programming paradigms, and parallel algorithms. Programming one or more parallel computers in a higher-level parallel language.', ''),
(8, 4, 'Analysis of Algorithms', 'CS325', 1, 'Recurrence relations, combinatorics, recursive algorithms, proofs of correctness.', ''),
(9, 4, 'Introduction to Digital Forensics', 'CS477', 0, 'Introduces concepts related to digital forensics, its role and importance, and tools and techniques for collecting and curating digital evidence. The course will also discuss the role of evidence in the justice system and some legal aspects as they pertain to digital forensics. It will introduce tools and techniques for computer and network forensics.', 'CS 344 and 370.\r\nA minimum grade of C is required in CS 344 and CS 370.\r\n\r\nEnrollment limited to students in the College of Engineering college.'),
(10, 4, 'Mobile Software Development', 'CS492', 0, 'Introduction to concepts and techniques for developing mobile applications. Students will become familiar with modern mobile structure, implementation, development tools, and workflow.', ''),
(11, 4, 'Cloud Application Development', 'CS493', 0, 'Covers developing RESTful cloud services, an approach based on representational state transfer technology, an architectural style and approach to communications used in modern cloud services development.', ''),
(12, 4, 'Data Science Tools and Programming', 'CS512', 2, 'Accessing and distributing data in the cloud; relational and non-relational databases; map reduction; cloud data processing; load balancing; types of data-stores used in the cloud.', 'CS 511 or an equivalent course or programming experience in in a high-level language like Python, Java or C++.'),
(13, 4, 'Introduction to Parallel Programming', 'CS575', 2, 'Theoretical and practical survey of parallel programming, including a discussion of parallel architecture, parallel programming paradigms, and parallel algorithms. Programming one or more parallel computers in a higher-level parallel language.', ''),
(14, 4, 'Introductory Biology I', 'BI204', 0, 'Foundations of biological sciences including scientific inquiry, genetics, evolution, and ecology. Significant emphasis throughout on the application of core concepts to solve human and environmental problems. Laboratory emphasizes skills in critical thinking, scientific writing, and experimental design. Not intended for pre-health profession students. Lec/lab. (Bacc Core Course)', ''),
(15, 4, 'Introductory Biology II', 'BI205', 0, 'Fundamental concepts in molecular and cellular biology, beginning with biomolecules and the origin of life, and ending with genomics. Significant emphasis throughout on applications of biotechnology to solve human problems. Laboratory emphasizes skills in critical thinking, scientific writing, and experimental design. Not intended for pre-health profession students. Lec/lab. (Bacc Core Course)', 'CH 121* or 201* or ((CH 231* or 231H*) and (CH 261*, 261H*, 271* or 271H*)).\r\n* May be taken concurrently.\r\nA minimum grade of D- is required in CH 121, CH 201, CH 231, CH 231H, CH 261, CH 261H, CH 271 and CH 271H.'),
(16, 4, 'Introductory Biology III', 'BI206', 0, 'Basic plant and animal physiology from an evolutionary perspective. Significant emphasis on topics of importance to human society, including human and plant disease. Laboratory emphasizes skills in critical thinking, scientific writing, and experimental design. Not intended for pre-health professional students. Lec/lab. (Bacc Core Course)', ' CH 121* or 201* or ((CH 231* or 231H*) and (CH 261*, 261H*, 271* or 271H*)).\r\n* May be taken concurrently.\r\nA minimum grade of D- is required in CH 121, CH 201, CH 231, CH 231H, CH 261, CH 261H, CH 271 and CH 271H.'),
(17, 4, 'Introduction to Plant Biology ', 'BOT220', 0, 'Introduction to plant biology including an overview of major groups of plants, plant cells and cell types, plant anatomy and architecture, physiology and function, and ecology and the roles of plants in the environment. Laboratory exercises build on lecture themes and provide hands-on learning experiences including field trips. Lec/lab. (Bacc Core Course)', ''),
(18, 3, 'Chemistry for Engineering Majors', 'CH201', 0, 'A sequence of selected chemistry topics for pre-engineering students. Lec.', 'MTH 111*, 112*, 251*, 251H*, 252*, 252H*, 254*, 254H* or minimum score of 060 in \'Math'),
(19, 4, 'General Chemistry', 'CH232', 0, 'A general chemistry sequence for students majoring in most sciences, pre-pharmacy, and chemical engineering. CH 232 is a lecture course; CH 262 is the laboratory component. Lec/rec. (Bacc Core Course if taken with CH 262)', '(CH 231 or 231H) or CH 221.\r\nA minimum grade of C- is required in CH 231, CH 231H and CH 221.'),
(20, 3, 'Interpersonal Communication', 'COMM218', 0, 'Introduction to dyadic and relational communication. Overview of current research in such areas as verbal and nonverbal messages, self-concept and perception, culture and gender stereotypes and styles, relational development and dissolution, deception, compliance gaining and conflict management. (Bacc Core Course)', ''),
(21, 4, 'Introduction to the Complexity of Oregon Cropping Systems', 'CROP280', 0, 'An introduction to field cropping systems of western Oregon. Provides students with a broad overview of the complexity of cropping systems and the knowledge required to grow and produce a crop--plant physiology, seed biology, plant pathology, soil fertility, entomology, and weed science. Students will observe a crop under different management strategies to enhance understanding of management approaches.', ''),
(22, 4, 'The New American Cinema', 'FILM245', 0, 'A formalist, ideological, and commercial investigation into contemporary American cinema. Three hours of lecture and separate screenings each week. Film fee required. Not offered every year. (H) (Bacc Core Course)', ''),
(23, 3, 'Field Sampling of Fish and Wildlife', 'FW255', 0, 'Introduction to sampling populations and communities of vertebrate animals emphasizing sampling design, collection and management of data, and communication of results.', ''),
(24, 4, 'Forest Biology', 'FES240', 0, 'Structure, function, development and biology of forest vegetation and their relationships to forestry and natural resource applications. Field trips required. Lec/lab/rec. (Bacc Core Course)', ''),
(25, 4, 'Environmental Geology', 'GEO221', 0, 'Introductory geology emphasizing geologic hazards (volcanoes, earthquakes, landslides, flooding), geologic resources (water, soil, air, mineral, energy), and associated environmental problems and mitigation strategies. Lec/lab. (Bacc Core Course)', ''),
(26, 3, 'Digital Logic Design', 'ECE271', 0, 'A first course in digital logic design. Data types and representations, Boolean algebra, state machines, simplification of switching expressions, and introductory computer arithmetic. Lec/rec.', 'MTH 251*, 251H* or 231*.\r\n* May be taken concurrently.\r\nA minimum grade of C is required in MTH 251, MTH 251H and MTH 231.'),
(27, 1, 'Digital Logic Design Laboratory', 'ECE272', 0, 'This laboratory course accompanies ECE 271, Digital Logic Design. This also illustrates topics covered in the lectures of ECE 271 using computer-aided design, verification tools, and prototyping hardware.', ''),
(28, 3, 'Electronics 1', 'ECE322', 0, 'Fundamental device characteristics including diodes, MOSFETs and bipolar transistors; small- and large-signal characteristics and design of linear circuits.', 'ENGR 203.\r\nA minimum grade of C is required in ENGR 203.\r\nEnrollment limited to students in the College of Engineering college.'),
(29, 3, 'Electronics 2', 'ECE323', 0, 'Transient operation of MOSFETs and bipolar transistors; multistage amplifiers; frequency response; feedback and stability.', 'ECE 322.\r\nA minimum grade of C is required in ECE 322.\r\nEnrollment limited to students in the College of Engineering college.'),
(30, 4, 'Electromechanical Energy Conversion', 'ECE331', 0, 'Energy conversion principles for electric machines. Steady state characteristics of direct current, induction, and synchronous machines. Application of stepper and servo motors and synchronous generators.', '(ENGR 202 or 202H) and MTH 256 and PH 213.\r\nA minimum grade of C is required in ENGR 202, ENGR 202H, MTH 256 and PH 213.\r\n\r\nEnrollment limited to students in the College of Engineering college.'),
(31, 1, 'Laboratory Electromechanical Energy Conversion', 'ECE332', 0, 'DC, PMAC, and induction machine testing, operation, and control.', 'ENGR 202 or 202H. A minimum grade of C is required in ENGR 202 and ENGR 202H.'),
(32, 3, 'Junior Design 1', 'ECE341', 0, 'Introduction to system design and group projects. Design and fabrication of an electrical engineering project in a small group.', 'CS 261* and ENGR 203.\r\n* May be taken concurrently.\r\nA minimum grade of C is required in CS 261 and ENGR 203.\r\n\r\nEnrollment limited to students in the College of Engineering college.'),
(33, 3, 'Junior Design 2', 'ECE342', 0, 'Introduction to system design and group projects. Design and fabrication of an electrical engineering project in a small group.', 'ECE 341.\r\nA minimum grade of C is required in ECE 341.\r\n\r\nEnrollment limited to students in the College of Engineering college.'),
(34, 3, 'Signals and Systems 1', 'ECE351', 0, 'Analytical techniques for continuous-time and discrete-time signal, system, and circuit analysis. Lec.', 'ENGR 203 and (MTH 256 or 256H).\r\nA minimum grade of C is required in ENGR 203, MTH 256 and MTH 256H.\r\n\r\nEnrollment limited to students in the College of Engineering college.'),
(35, 3, 'Signals and Systems 2', 'ECE352', 0, 'Analytical techniques for continuous-time and discrete-time signal, system, and circuit analysis.', 'ECE 351 and (MTH 306 or 306H).\r\nA minimum grade of C is required in ECE 351, MTH 306 and MTH 306H.\r\n\r\nEnrollment limited to students in the College of Engineering college.'),
(36, 3, 'Introduction to Probability and Random Signals', 'ECE353', 0, 'Introductory discrete and continuous probability concepts, single and multiple random variable distributions, expectation, introductory stochastic processes, correlation and power spectral density properties of random signals, random signals through linear filters. Lec.', 'ECE 351 and (MTH 254 or 254H).\r\nA minimum grade of C is required in ECE 351, MTH 254 and MTH 254H.\r\n\r\nEnrollment limited to students in the College of Engineering college.'),
(37, 4, 'Introduction to Computer Networks', 'ECE372', 0, 'Computer network principles, fundamental networking concepts, packet-switching and circuit-switching, TCP/IP protocol layers, reliable data transfer, congestion control, flow control, packet forwarding and routing, MAC addressing, multiple access techniques. Lec. CROSSLISTED as CS 372.', 'CS 261 and (ECE 271 or CS 271).\r\nA minimum grade of C is required in CS 261, ECE 271 and CS 271.\r\n\r\nEnrollment limited to students in the College of Engineering college.'),
(38, 4, 'Computer Organization and Assembly Language Programming', 'ECE375', 0, 'Introduction to computer organization, how major components in a computer system function together in executing a program, and assembly language programming. Lec/lab.', ''),
(39, 4, 'Electric and Magnetic Fields', 'ECE390', 0, 'Static and quasi-static electric and magnetic fields.', '(MTH 255 or 255H) and ENGR 203* and PH 213.\r\n* May be taken concurrently.\r\nA minimum grade of C is required in MTH 255, MTH 255H, ENGR 203 and PH 213.\r\n\r\nEnrollment limited to students in the College of Engineering college.'),
(40, 3, 'Transmission Lines', 'ECE391', 0, 'Transient and steady-state analysis of transmission line circuits with application to engineering problems.', 'ECE 322* and ENGR 203 and (MTH 254 or 254H) and (MTH 256 or 256H).\r\n* May be taken concurrently.\r\nA minimum grade of C is required in ECE 322, ENGR 203, MTH 254, MTH 254H, MTH 256 and MTH 256H.\r\n\r\nEnrollment limited to students in the College of Engineering college.');

-- --------------------------------------------------------

--
-- Table structure for table `Plan`
--

CREATE TABLE `Plan` (
  `planId` int NOT NULL,
  `status` int NOT NULL,
  `planName` varchar(50) NOT NULL,
  `studentId` int NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastUpdated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Plan`
--

INSERT INTO `Plan` (`planId`, `status`, `planName`, `studentId`, `created`) VALUES
(308, 3, 'Luke\'s Plan', 1, '2020-01-01 11:35:42'),
(310, 0, 'Han\'s cool plan', 5, '2020-01-02 11:35:42'),
(358, 2, 'Another Plan by Luke', 1, '2020-01-06 11:35:42'),
(359, 2, 'Luke\'s ECE plan', 1, '2020-01-17 11:35:42'),
(360, 2, 'Han\'s ECE plan', 5, '2020-01-18 11:35:42');

-- --------------------------------------------------------

--
-- Table structure for table `PlanReview`
--

CREATE TABLE `PlanReview` (
  `planId` int NOT NULL,
  `advisorId` int NOT NULL,
  `newStatus` int NOT NULL,
  `timeReviewed` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `PlanReview`
--

INSERT INTO `PlanReview` (`planId`, `advisorId`, `newStatus`) VALUES
(308, 9, 3),
(310, 4, 3),
(310, 6, 0);

-- --------------------------------------------------------

--
-- Table structure for table `SelectedCourse`
--

CREATE TABLE `SelectedCourse` (
  `planId` int NOT NULL,
  `courseId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `SelectedCourse`
--

INSERT INTO `SelectedCourse` (`planId`, `courseId`) VALUES
(310, 5),
(358, 5),
(310, 7),
(358, 7),
(310, 9),
(358, 9),
(310, 10),
(358, 10),
(310, 11),
(358, 11),
(308, 14),
(358, 14),
(308, 15),
(358, 15),
(308, 16),
(358, 16),
(308, 17),
(358, 17),
(308, 18),
(310, 18),
(358, 18),
(308, 19),
(310, 19),
(310, 20),
(308, 21),
(310, 22),
(308, 23),
(308, 25),
(359, 26),
(360, 26),
(359, 27),
(360, 27),
(359, 28),
(360, 28),
(359, 29),
(360, 29),
(359, 30),
(360, 30),
(359, 31),
(360, 31),
(359, 32),
(360, 32),
(359, 33),
(360, 33),
(359, 34),
(360, 34),
(359, 35),
(360, 35),
(359, 36),
(360, 36),
(359, 37),
(360, 37);

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `userId` int NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `role` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`userId`, `firstName`, `lastName`, `email`, `role`) VALUES
(1, 'Luke', 'Skywalker', 'usetheforce@gmail.com', 0),
(2, 'Wilhuff', 'Tarkin', 'grandmoff@yahoo.com', 0),
(3, 'Owen', 'Lars', 'powerConverters@msn.com', 0),
(4, 'Gial', 'Ackbar', 'its-a-trap@yahoo.com', 1),
(5, 'Han', 'Solo', 'kessel_run@aol.com', 0),
(6, 'Sheev', 'Palpatine', 'order66@gmail.com', 2),
(7, 'Lando', 'Calrissian', 'cloud_city@hotmail.com', 0),
(8, 'Ben', 'Kenobi', 'hello-there@hotmail.com', 1),
(9, 'Leia', 'Organa', 'CinnamonBuns@msn.com', 1),
(10, 'Boba', 'Fett', 'bounty-hunter@yahoo.com', 0),
(11, 'Anakin', 'Skywalker', 'darth-vader@gmail.com', 1),
(12, 'Wicket', 'Warrick', 'sell-toys@yahoo.com', 0),
(13, 'Wedge', 'Antilles', 'x-wing@aol.com', 0),
(14, 'R2', 'D2', 'artoo@gmail.com', 0),
(15, 'C', '3PO', 'human_cyborg_relations@aol.com', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Comment`
--
ALTER TABLE `Comment`
  ADD PRIMARY KEY (`commentId`),
  ADD KEY `fk_planIdComment` (`planId`),
  ADD KEY `fk_userId` (`userId`);

--
-- Indexes for table `Course`
--
ALTER TABLE `Course`
  ADD PRIMARY KEY (`courseId`),
  ADD UNIQUE KEY `courseCode` (`courseCode`);

--
-- Indexes for table `Plan`
--
ALTER TABLE `Plan`
  ADD PRIMARY KEY (`planId`),
  ADD KEY `fk_studentId` (`studentId`);

--
-- Indexes for table `PlanReview`
--
ALTER TABLE `PlanReview`
  ADD PRIMARY KEY (`planId`,`advisorId`),
  ADD KEY `fk_advisorId` (`advisorId`);

--
-- Indexes for table `SelectedCourse`
--
ALTER TABLE `SelectedCourse`
  ADD PRIMARY KEY (`planId`,`courseId`),
  ADD KEY `fk_courseId` (`courseId`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Comment`
--
ALTER TABLE `Comment`
  MODIFY `commentId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `Course`
--
ALTER TABLE `Course`
  MODIFY `courseId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `Plan`
--
ALTER TABLE `Plan`
  MODIFY `planId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=361;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `userId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Comment`
--
ALTER TABLE `Comment`
  ADD CONSTRAINT `fk_planIdComment` FOREIGN KEY (`planId`) REFERENCES `Plan` (`planId`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_userId` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`);

--
-- Constraints for table `Plan`
--
ALTER TABLE `Plan`
  ADD CONSTRAINT `fk_studentId` FOREIGN KEY (`studentId`) REFERENCES `User` (`userId`);

--
-- Constraints for table `PlanReview`
--
ALTER TABLE `PlanReview`
  ADD CONSTRAINT `fk_advisorId` FOREIGN KEY (`advisorId`) REFERENCES `User` (`userId`),
  ADD CONSTRAINT `fk_planId` FOREIGN KEY (`planId`) REFERENCES `Plan` (`planId`),
  ADD CONSTRAINT `fk_planId_Review` FOREIGN KEY (`planId`) REFERENCES `Plan` (`planId`) ON DELETE CASCADE;

--
-- Constraints for table `SelectedCourse`
--
ALTER TABLE `SelectedCourse`
  ADD CONSTRAINT `fk_courseId` FOREIGN KEY (`courseId`) REFERENCES `Course` (`courseId`),
  ADD CONSTRAINT `fk_planIdCourse` FOREIGN KEY (`planId`) REFERENCES `Plan` (`planId`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 4.7.1
-- https://www.phpmyadmin.net/
--
-- Host: sql3.freesqldatabase.com
-- Generation Time: Jan 25, 2020 at 01:02 AM
-- Server version: 5.5.54-0ubuntu0.12.04.1
-- PHP Version: 7.0.33-0ubuntu0.16.04.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sql3317654`
--

-- --------------------------------------------------------

--
-- Table structure for table `Comment`
--

CREATE TABLE `Comment` (
  `commentId` int(11) NOT NULL,
  `planId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `text` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Course`
--

CREATE TABLE `Course` (
  `courseId` int(11) NOT NULL,
  `credits` int(2) NOT NULL,
  `courseName` varchar(100) NOT NULL,
  `courseCode` varchar(8) NOT NULL,
  `restriction` int(11) NOT NULL,
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
(18, 3, 'Chemistry for Engineering Majors', 'CH201', 0, 'A sequence of selected chemistry topics for pre-engineering students. Lec.', 'Prerequisites: MTH 111*, 112*, 251*, 251H*, 252*, 252H*, 254*, 254H* or minimum score of 060 in \'Math'),
(19, 4, 'General Chemistry', 'CH232', 0, 'A general chemistry sequence for students majoring in most sciences, pre-pharmacy, and chemical engineering. CH 232 is a lecture course; CH 262 is the laboratory component. Lec/rec. (Bacc Core Course if taken with CH 262)', '(CH 231 or 231H) or CH 221.\r\nA minimum grade of C- is required in CH 231, CH 231H and CH 221.'),
(20, 3, 'Interpersonal Communication', 'COMM218', 0, 'Introduction to dyadic and relational communication. Overview of current research in such areas as verbal and nonverbal messages, self-concept and perception, culture and gender stereotypes and styles, relational development and dissolution, deception, compliance gaining and conflict management. (Bacc Core Course)', ''),
(21, 4, 'Introduction to the Complexity of Oregon Cropping Systems', 'CROP280', 0, 'An introduction to field cropping systems of western Oregon. Provides students with a broad overview of the complexity of cropping systems and the knowledge required to grow and produce a crop--plant physiology, seed biology, plant pathology, soil fertility, entomology, and weed science. Students will observe a crop under different management strategies to enhance understanding of management approaches.', ''),
(22, 4, 'The New American Cinema', 'FILM245', 0, 'A formalist, ideological, and commercial investigation into contemporary American cinema. Three hours of lecture and separate screenings each week. Film fee required. Not offered every year. (H) (Bacc Core Course)', ''),
(23, 3, 'Field Sampling of Fish and Wildlife', 'FW255', 0, 'Introduction to sampling populations and communities of vertebrate animals emphasizing sampling design, collection and management of data, and communication of results.', ''),
(24, 4, 'Forest Biology', 'FES240', 0, 'Structure, function, development and biology of forest vegetation and their relationships to forestry and natural resource applications. Field trips required. Lec/lab/rec. (Bacc Core Course)', ''),
(25, 4, 'Environmental Geology', 'GEO221', 0, 'Introductory geology emphasizing geologic hazards (volcanoes, earthquakes, landslides, flooding), geologic resources (water, soil, air, mineral, energy), and associated environmental problems and mitigation strategies. Lec/lab. (Bacc Core Course)', '');

-- --------------------------------------------------------

--
-- Table structure for table `Plan`
--

CREATE TABLE `Plan` (
  `planId` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `planName` varchar(50) NOT NULL,
  `studentId` int(11) NOT NULL,
  `lastUpdated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `PlanReview`
--

CREATE TABLE `PlanReview` (
  `planId` int(11) NOT NULL,
  `advisorId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `SelectedCourse`
--

CREATE TABLE `SelectedCourse` (
  `planId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `userId` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `role` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`userId`, `firstName`, `lastName`, `email`, `role`) VALUES
(1, 'Luke', 'Skywalker', 'usetheforce@gmail.com', 0),
(2, 'Han', 'Solo', 'shotfirst@yahoo.com', 0),
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
  MODIFY `commentId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Course`
--
ALTER TABLE `Course`
  MODIFY `courseId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT for table `Plan`
--
ALTER TABLE `Plan`
  MODIFY `planId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=308;
--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `Comment`
--
ALTER TABLE `Comment`
  ADD CONSTRAINT `fk_planIdComment` FOREIGN KEY (`planId`) REFERENCES `Plan` (`planId`),
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
  ADD CONSTRAINT `fk_planId_Review` FOREIGN KEY (`planId`) REFERENCES `Plan` (`planId`),
  ADD CONSTRAINT `fk_advisorId` FOREIGN KEY (`advisorId`) REFERENCES `User` (`userId`),
  ADD CONSTRAINT `fk_planId` FOREIGN KEY (`planId`) REFERENCES `Plan` (`planId`);

--
-- Constraints for table `SelectedCourse`
--
ALTER TABLE `SelectedCourse`
  ADD CONSTRAINT `fk_planIdCourse` FOREIGN KEY (`planId`) REFERENCES `Plan` (`planId`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_courseId` FOREIGN KEY (`courseId`) REFERENCES `Course` (`courseId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

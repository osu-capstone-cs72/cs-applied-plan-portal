-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: classmysql.engr.oregonstate.edu:3306
-- Generation Time: Mar 19, 2020 at 07:36 PM
-- Server version: 10.4.11-MariaDB-log
-- PHP Version: 7.0.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `capstone_2019_thomasza`
--

-- --------------------------------------------------------

--
-- Table structure for table `Comment`
--

CREATE TABLE `Comment` (
  `commentId` int(11) NOT NULL,
  `planId` int(11) NOT NULL,
  `userId` bigint(11) UNSIGNED NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp(),
  `text` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Comment`
--

INSERT INTO `Comment` (`commentId`, `planId`, `userId`, `time`, `text`) VALUES
(1, 308, 12002489701, '2020-01-27 21:59:27', 'This is my plan.'),
(2, 308, 77768733898, '2020-02-04 11:36:44', 'This plan looks good!'),
(6, 310, 14278597767, '2020-02-04 09:48:25', 'I sure do love my plan.'),
(7, 310, 61846240923, '2020-02-14 11:37:33', 'I don\'t like this plan. Let\'s get rid of it.'),
(9, 310, 80612566209, '2020-02-15 11:46:27', 'Sure, plan rejected.'),
(46, 364, 64391826876, '2020-02-16 18:58:37', 'I think this is a great plan. I will go ahead and let the Head Advisor finalize this.'),
(73, 359, 80612566209, '2020-02-15 02:00:52', 'I think you should take GEO 221.\nI won\'t accept this plan otherwise.\nFix it.'),
(74, 362, 61846240923, '2020-02-20 17:31:12', 'Some comment'),
(86, 368, 82757579527, '2020-02-23 19:18:08', 'Good plan. I wonder why no one else thought to take no courses. Much easier that way.'),
(87, 362, 82757579527, '2020-02-23 19:22:53', 'Another comment'),
(88, 375, 82757579527, '2020-02-23 19:26:44', 'Here is the plan I made.'),
(102, 399, 82757579527, '2020-02-26 21:53:30', 'Here I am adding a comment.'),
(103, 399, 82757579527, '2020-02-26 23:26:13', 'Hello'),
(109, 368, 82757579527, '2020-02-29 03:12:14', 'I guess you might consider adding some courses.'),
(110, 364, 82757579527, '2020-03-02 22:21:09', 'This is a nice plan.'),
(111, 364, 82757579527, '2020-03-02 22:21:19', 'You should be proud of your nice plan.'),
(112, 364, 82757579527, '2020-03-02 22:21:28', 'One day it might get approved.'),
(113, 364, 82757579527, '2020-03-02 22:21:36', 'But today is not that day.'),
(114, 364, 82757579527, '2020-03-02 22:21:46', 'I am sure leaving a lot of comments on this plan.'),
(115, 364, 82757579527, '2020-03-02 22:21:58', 'I hope this isn\'t too many comments.'),
(116, 364, 82757579527, '2020-03-02 22:22:06', 'No one minds, right?'),
(117, 364, 82757579527, '2020-03-02 23:25:21', 'New comment now'),
(118, 364, 82757579527, '2020-03-02 23:52:23', 'New comment'),
(119, 364, 82757579527, '2020-03-04 01:06:48', 'This a new comment'),
(121, 364, 82757579527, '2020-03-05 18:34:29', 'Newest comment yet.'),
(122, 364, 82757579527, '2020-03-05 18:35:53', 'Even newer comment'),
(123, 364, 82757579527, '2020-03-05 18:36:23', 'More comments'),
(124, 405, 82757579527, '2020-03-06 02:48:23', 'This plan looks good. I am going to set it to awaiting final review.'),
(125, 410, 82757579527, '2020-03-08 23:55:36', 'This plan doesn\'t have a clear focus. Create a plan that offers more attention to a specific field.'),
(129, 405, 82757579527, '2020-03-09 17:49:07', 'Good amount of credits.'),
(130, 405, 82757579527, '2020-03-09 17:49:24', 'Good selection of courses.'),
(131, 405, 82757579527, '2020-03-09 17:49:35', 'I will approve this plan.'),
(133, 420, 84979840992, '2020-03-10 07:45:08', 'Bro thats kinda cringe bro'),
(136, 420, 82757579527, '2020-03-13 19:04:09', 'This is a comment'),
(137, 358, 82757579527, '2020-03-14 03:12:03', 'Hello Luke'),
(138, 375, 60535363653, '2020-03-14 03:12:55', 'This plan looks great!'),
(139, 360, 82757579527, '2020-03-15 05:38:26', 'Hello');

-- --------------------------------------------------------

--
-- Table structure for table `Course`
--

CREATE TABLE `Course` (
  `courseId` int(11) NOT NULL,
  `credits` int(11) NOT NULL,
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
-- Table structure for table `Notification`
--

CREATE TABLE `Notification` (
  `notificationId` int(11) NOT NULL,
  `planId` int(11) NOT NULL,
  `userId` bigint(11) UNSIGNED NOT NULL,
  `text` varchar(100) NOT NULL,
  `type` int(11) NOT NULL,
  `checked` tinyint(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Notification`
--

INSERT INTO `Notification` (`notificationId`, `planId`, `userId`, `text`, `type`, `checked`) VALUES
(43, 405, 19424289189, 'Zachary Thomas has added a new comment to the plan \"Claire\'s plan\".', 1, 1),
(44, 405, 19424289189, 'The plan \"Claire\'s plan\" has been set to \"Accepted\" by Zachary Thomas.', 2, 1),
(46, 359, 12002489701, 'The plan \"ECE Plan by Luke\" has been set to \"Awaiting review\" by Zachary Thomas.', 2, 0),
(47, 359, 80612566209, 'The plan \"ECE Plan by Luke\" has been set to \"Awaiting review\" by Zachary Thomas.', 2, 0),
(48, 359, 64391826876, 'The plan \"ECE Plan by Luke\" has been set to \"Awaiting review\" by Zachary Thomas.', 2, 0),
(52, 421, 84979840992, 'The plan \"Biology and Chemistry\" has been set to \"Awaiting student changes\" by Zachary Thomas.', 2, 1),
(53, 421, 84979840992, 'The plan \"Biology and Chemistry\" has been set to \"Awaiting final review\" by Zachary Thomas.', 2, 1),
(54, 421, 84979840992, 'The plan \"Biology and Chemistry\" has been set to \"Accepted\" by Zachary Thomas.', 2, 1),
(55, 420, 84979840992, 'Zachary Thomas has added a new comment to the plan \"Test plan\".', 1, 1),
(56, 358, 12002489701, 'Zachary Thomas has added a new comment to the plan \"Another Plan by Luke 2\".', 1, 0),
(57, 358, 12002489701, 'The plan \"Another Plan by Luke 2\" has been set to \"Awaiting final review\" by Zachary Thomas.', 2, 0),
(58, 375, 82757579527, 'Phi Luu has added a new comment to the plan \"This is a great plan\".', 1, 0),
(59, 375, 77768733898, 'Phi Luu has added a new comment to the plan \"This is a great plan\".', 1, 0),
(60, 360, 14278597767, 'Zachary Thomas has added a new comment to the plan \"San\'s ECE plan\".', 1, 0),
(61, 360, 14278597767, 'The plan \"San\'s ECE plan\" has been set to \"Awaiting final review\" by Zachary Thomas.', 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `Plan`
--

CREATE TABLE `Plan` (
  `planId` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `planName` varchar(50) NOT NULL,
  `studentId` bigint(11) UNSIGNED NOT NULL,
  `created` timestamp NOT NULL DEFAULT current_timestamp(),
  `lastUpdated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Plan`
--

INSERT INTO `Plan` (`planId`, `status`, `planName`, `studentId`, `created`, `lastUpdated`) VALUES
(308, 4, 'Luke\'s Plan', 12002489701, '2020-01-01 11:35:42', '2020-02-29 19:19:36'),
(310, 0, 'San\'s cool plan', 14278597767, '2020-01-02 11:35:42', '2020-03-14 00:27:37'),
(358, 3, 'Another Plan by Luke 2', 12002489701, '2020-01-06 11:35:42', '2020-03-14 03:12:19'),
(359, 2, 'ECE Plan by Luke', 12002489701, '2020-01-17 11:35:42', '2020-03-10 23:29:38'),
(360, 3, 'San\'s ECE plan', 14278597767, '2020-01-18 11:35:42', '2020-03-15 05:38:35'),
(361, 1, 'Wicket\'s Plan', 10157289101, '2020-02-11 21:37:22', '2020-02-16 19:54:53'),
(362, 3, 'some plan', 12002489701, '2020-02-12 00:36:38', '2020-02-23 19:22:58'),
(364, 3, 'Boba\'s Plan', 19654375695, '2020-02-16 18:57:30', '2020-03-05 18:37:05'),
(368, 2, 'Phi\'s plan', 60535363653, '2020-02-19 04:34:14', '2020-03-14 03:12:26'),
(375, 3, 'This is a great plan', 82757579527, '2020-02-23 19:26:36', '2020-02-25 04:46:55'),
(399, 0, 'No-CS plan', 82757579527, '2020-02-26 21:53:14', '2020-02-26 23:27:43'),
(405, 4, 'Claire\'s plan', 19424289189, '2020-03-06 02:47:12', '2020-03-09 17:54:40'),
(406, 4, 'Same plan 1', 73611589202, '2020-03-08 19:03:39', '2020-03-08 19:06:45'),
(407, 4, 'Same plan 2', 73611589202, '2020-03-08 19:04:14', '2020-03-08 19:06:59'),
(408, 4, 'Same plan 3', 73611589202, '2020-03-08 19:04:41', '2020-03-08 22:02:33'),
(409, 0, 'Same plan 4', 73611589202, '2020-03-08 19:05:20', '2020-03-08 19:07:11'),
(410, 0, 'Mixed plan', 97689531333, '2020-03-08 23:51:34', '2020-03-08 23:55:43'),
(411, 2, 'Random courses', 74237743225, '2020-03-08 23:52:31', '2020-03-08 23:54:31'),
(412, 2, 'Lots of credits', 82757579527, '2020-03-09 13:13:01', '2020-03-09 14:07:54'),
(413, 1, 'Mixed plan', 82757579527, '2020-03-09 13:42:11', '2020-03-13 09:14:55'),
(414, 2, 'ECE plan', 82757579527, '2020-03-09 13:43:14', '2020-03-09 14:57:47'),
(415, 2, 'Lots of credits', 19424289189, '2020-03-10 01:30:04', '2020-03-10 01:30:04'),
(416, 2, 'Great plan right here', 19424289189, '2020-03-10 01:31:08', '2020-03-10 01:31:08'),
(417, 4, 'ECE and CS', 19424289189, '2020-03-10 01:31:43', '2020-03-15 21:34:17'),
(418, 2, 'Science and ECE', 19424289189, '2020-03-10 01:32:20', '2020-03-10 01:32:20'),
(419, 2, '42 Credit Plan', 19424289189, '2020-03-10 01:32:58', '2020-03-10 01:32:58'),
(420, 2, 'Test plan', 84979840992, '2020-03-10 05:19:15', '2020-03-10 05:19:15'),
(421, 4, 'Biology and Chemistry', 84979840992, '2020-03-13 03:00:56', '2020-03-13 03:03:52'),
(423, 2, 'This is a new plan', 82757579527, '2020-03-15 05:32:44', '2020-03-15 05:33:47');

-- --------------------------------------------------------

--
-- Table structure for table `PlanReview`
--

CREATE TABLE `PlanReview` (
  `reviewId` int(11) NOT NULL,
  `planId` int(11) NOT NULL,
  `userId` bigint(11) UNSIGNED NOT NULL,
  `status` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `PlanReview`
--

INSERT INTO `PlanReview` (`reviewId`, `planId`, `userId`, `status`, `time`) VALUES
(2, 308, 77768733898, 3, '2020-02-14 21:12:07'),
(3, 310, 64391826876, 3, '2020-02-13 21:12:07'),
(4, 310, 80612566209, 0, '2020-02-15 21:12:08'),
(5, 361, 77768733898, 1, '2020-02-14 21:12:08'),
(6, 361, 15999951730, 1, '2020-02-16 21:12:09'),
(7, 361, 10157289101, 2, '2020-02-15 21:12:09'),
(9, 308, 80612566209, 4, '2020-02-14 23:35:25'),
(30, 359, 80612566209, 1, '2020-02-16 00:25:09'),
(31, 359, 12002489701, 2, '2020-02-16 00:25:26'),
(34, 359, 64391826876, 3, '2020-02-16 04:33:41'),
(42, 364, 64391826876, 3, '2020-02-16 18:58:48'),
(58, 368, 82757579527, 3, '2020-02-23 19:17:40'),
(59, 368, 82757579527, 4, '2020-02-23 19:18:16'),
(64, 362, 82757579527, 3, '2020-02-23 19:22:58'),
(71, 375, 77768733898, 3, '2020-02-25 04:46:55'),
(100, 399, 15999951730, 3, '2020-02-26 23:26:36'),
(101, 399, 80612566209, 1, '2020-02-26 23:27:19'),
(102, 399, 77768733898, 0, '2020-02-26 23:27:43'),
(124, 368, 82757579527, 2, '2020-02-29 03:11:59'),
(125, 364, 82757579527, 1, '2020-03-03 16:22:20'),
(126, 364, 82757579527, 0, '2020-03-03 16:22:26'),
(127, 364, 82757579527, 2, '2020-03-04 01:06:29'),
(128, 364, 82757579527, 3, '2020-03-05 18:37:05'),
(129, 405, 77768733898, 3, '2020-03-06 02:48:26'),
(130, 406, 82757579527, 4, '2020-03-08 19:06:45'),
(131, 407, 82757579527, 4, '2020-03-08 19:06:59'),
(132, 409, 82757579527, 0, '2020-03-08 19:07:11'),
(133, 408, 82757579527, 0, '2020-03-08 19:07:29'),
(134, 408, 82757579527, 4, '2020-03-08 22:02:33'),
(135, 410, 82757579527, 0, '2020-03-08 23:55:43'),
(138, 405, 80612566209, 4, '2020-03-09 17:54:13'),
(141, 359, 82757579527, 2, '2020-03-10 23:29:38'),
(161, 421, 15999951730, 1, '2020-03-13 03:03:30'),
(162, 421, 77768733898, 3, '2020-03-13 03:03:38'),
(163, 421, 80612566209, 4, '2020-03-13 03:03:52'),
(164, 413, 19424289189, 1, '2020-03-13 09:11:16'),
(165, 413, 82757579527, 2, '2020-03-13 09:11:25'),
(166, 413, 84979840992, 1, '2020-03-13 09:11:30'),
(167, 413, 82757579527, 2, '2020-03-13 09:14:44'),
(168, 413, 60535363653, 1, '2020-03-13 09:14:55'),
(169, 358, 82757579527, 3, '2020-03-14 03:12:19'),
(170, 360, 82757579527, 3, '2020-03-15 05:38:35'),
(171, 417, 19424289189, 4, '2020-03-15 21:34:17');

-- --------------------------------------------------------

--
-- Table structure for table `RecentPlan`
--

CREATE TABLE `RecentPlan` (
  `recentId` int(11) NOT NULL,
  `planId` int(11) NOT NULL,
  `userId` bigint(11) UNSIGNED NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `RecentPlan`
--

INSERT INTO `RecentPlan` (`recentId`, `planId`, `userId`, `time`) VALUES
(1, 364, 80612566209, '2020-02-29 23:10:33'),
(330, 362, 19424289189, '2020-03-10 23:39:44'),
(508, 358, 19424289189, '2020-03-13 22:27:11'),
(568, 375, 84979840992, '2020-03-14 00:26:59'),
(616, 358, 84979840992, '2020-03-14 02:23:44'),
(626, 399, 60535363653, '2020-03-14 02:53:55'),
(633, 368, 60535363653, '2020-03-14 03:12:27'),
(634, 375, 60535363653, '2020-03-14 03:12:47'),
(636, 361, 84979840992, '2020-03-14 03:15:01'),
(637, 310, 84979840992, '2020-03-14 03:15:22'),
(639, 360, 84979840992, '2020-03-14 03:15:30'),
(654, 410, 19424289189, '2020-03-15 21:32:03'),
(655, 308, 19424289189, '2020-03-15 21:33:46'),
(656, 417, 19424289189, '2020-03-15 21:34:09'),
(658, 310, 82757579527, '2020-03-15 23:18:30'),
(659, 360, 82757579527, '2020-03-15 23:18:36'),
(660, 375, 82757579527, '2020-03-15 23:19:35'),
(662, 406, 82757579527, '2020-03-16 03:37:38'),
(663, 362, 82757579527, '2020-03-17 00:21:43');

-- --------------------------------------------------------

--
-- Table structure for table `SelectedCourse`
--

CREATE TABLE `SelectedCourse` (
  `planId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `SelectedCourse`
--

INSERT INTO `SelectedCourse` (`planId`, `courseId`) VALUES
(308, 14),
(308, 15),
(308, 16),
(308, 17),
(308, 18),
(308, 19),
(308, 21),
(308, 23),
(308, 25),
(310, 5),
(310, 7),
(310, 9),
(310, 10),
(310, 11),
(310, 18),
(310, 19),
(310, 20),
(310, 22),
(358, 5),
(358, 7),
(358, 9),
(358, 10),
(358, 14),
(358, 15),
(358, 16),
(358, 17),
(358, 18),
(359, 5),
(359, 7),
(359, 9),
(359, 10),
(359, 11),
(359, 17),
(359, 18),
(359, 23),
(359, 24),
(359, 25),
(360, 26),
(360, 28),
(360, 29),
(360, 30),
(360, 31),
(360, 32),
(360, 33),
(360, 34),
(360, 35),
(360, 36),
(360, 37),
(361, 26),
(361, 27),
(361, 28),
(361, 29),
(361, 30),
(361, 31),
(361, 32),
(361, 33),
(361, 34),
(361, 35),
(361, 36),
(361, 37),
(362, 26),
(362, 27),
(362, 28),
(362, 29),
(362, 30),
(362, 31),
(362, 32),
(362, 33),
(362, 34),
(362, 35),
(362, 36),
(362, 37),
(364, 5),
(364, 7),
(364, 9),
(364, 10),
(364, 11),
(364, 14),
(364, 15),
(364, 16),
(364, 17),
(364, 26),
(368, 1),
(368, 5),
(368, 7),
(368, 9),
(368, 10),
(368, 11),
(368, 26),
(368, 27),
(368, 28),
(368, 29),
(375, 5),
(375, 18),
(375, 22),
(375, 26),
(375, 28),
(375, 29),
(375, 30),
(375, 32),
(375, 33),
(375, 35),
(399, 14),
(399, 15),
(399, 16),
(399, 18),
(399, 19),
(399, 22),
(399, 23),
(399, 24),
(399, 25),
(399, 40),
(405, 5),
(405, 14),
(405, 15),
(405, 16),
(405, 18),
(405, 19),
(405, 22),
(405, 24),
(405, 25),
(406, 26),
(406, 27),
(406, 28),
(406, 29),
(406, 30),
(406, 31),
(406, 32),
(406, 33),
(406, 34),
(406, 35),
(406, 36),
(406, 37),
(407, 26),
(407, 27),
(407, 28),
(407, 29),
(407, 30),
(407, 31),
(407, 32),
(407, 33),
(407, 34),
(407, 35),
(407, 36),
(407, 37),
(408, 26),
(408, 27),
(408, 28),
(408, 29),
(408, 30),
(408, 31),
(408, 32),
(408, 33),
(408, 34),
(408, 35),
(408, 36),
(408, 37),
(409, 26),
(409, 27),
(409, 28),
(409, 29),
(409, 30),
(409, 31),
(409, 32),
(409, 33),
(409, 34),
(409, 35),
(409, 36),
(409, 37),
(410, 14),
(410, 15),
(410, 16),
(410, 17),
(410, 18),
(410, 19),
(410, 22),
(410, 24),
(410, 25),
(411, 14),
(411, 15),
(411, 16),
(411, 17),
(411, 18),
(411, 19),
(411, 22),
(411, 24),
(411, 25),
(412, 1),
(412, 7),
(412, 9),
(412, 10),
(412, 11),
(412, 31),
(412, 32),
(412, 33),
(412, 34),
(412, 35),
(412, 36),
(412, 37),
(412, 38),
(412, 39),
(413, 1),
(413, 5),
(413, 7),
(413, 9),
(413, 10),
(413, 11),
(413, 14),
(413, 15),
(413, 16),
(413, 18),
(413, 19),
(414, 26),
(414, 27),
(414, 28),
(414, 29),
(414, 30),
(414, 31),
(414, 32),
(414, 33),
(414, 34),
(414, 35),
(414, 36),
(414, 37),
(415, 1),
(415, 5),
(415, 7),
(415, 9),
(415, 10),
(415, 11),
(415, 32),
(415, 34),
(415, 35),
(415, 36),
(415, 37),
(415, 38),
(415, 39),
(415, 40),
(416, 1),
(416, 5),
(416, 7),
(416, 9),
(416, 10),
(416, 11),
(416, 14),
(416, 18),
(416, 19),
(417, 1),
(417, 5),
(417, 7),
(417, 9),
(417, 10),
(417, 11),
(417, 34),
(417, 35),
(417, 36),
(418, 14),
(418, 15),
(418, 16),
(418, 18),
(418, 19),
(418, 26),
(418, 27),
(418, 28),
(418, 30),
(418, 32),
(419, 1),
(419, 5),
(419, 7),
(419, 9),
(419, 10),
(419, 11),
(419, 14),
(419, 15),
(419, 16),
(419, 18),
(419, 19),
(420, 26),
(420, 27),
(420, 28),
(420, 29),
(420, 30),
(420, 31),
(420, 32),
(420, 33),
(420, 34),
(420, 35),
(420, 36),
(420, 37),
(421, 14),
(421, 15),
(421, 16),
(421, 17),
(421, 18),
(421, 19),
(421, 23),
(421, 24),
(421, 28),
(423, 1),
(423, 26),
(423, 27),
(423, 28),
(423, 29),
(423, 30),
(423, 31),
(423, 32),
(423, 33),
(423, 35),
(423, 36),
(423, 37);

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `userId` bigint(11) UNSIGNED NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `role` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`userId`, `firstName`, `lastName`, `email`, `role`) VALUES
(10157289101, 'Wicket', 'Warrick', 'sell-toys@yahoo.com', 0),
(12002489701, 'Luke', 'Skywalker', 'usetheforce@gmail.com', 0),
(14278597767, 'San', 'Holo', 'vibrant@birbspotters.nl', 0),
(15999951730, 'Anakin', 'Skywalker', 'darth-vader@gmail.com', 0),
(19424289189, 'Claire', 'Cahill', 'cahillc@oregonstate.edu', 2),
(19654375695, 'Boba', 'Fett', 'bounty-hunter@yahoo.com', 0),
(50734529811, 'R2', 'D2', 'artoo@gmail.com', 0),
(60535363653, 'Phi', 'Luu', 'luuph@oregonstate.edu', 2),
(61846240923, 'Wilhuff', 'Tarkin', 'grandmoff@yahoo.com', 1),
(64391826876, 'Gial', 'Ackbar', 'its-a-trap@yahoo.com', 1),
(73611589202, 'Owen', 'Lars', 'powerConverters@msn.com', 0),
(74237743225, 'Wedge', 'Antilles', 'x-wing@aol.com', 0),
(77768733898, 'Leia', 'Organa', 'CinnamonBuns@msn.com', 1),
(80612566209, 'Sheev', 'Palpatine', 'order66@gmail.com', 2),
(82757579527, 'Zachary', 'Thomas', 'thomasza@oregonstate.edu', 2),
(84979840992, 'Jackson', 'Golletz', 'golletzj@oregonstate.edu', 2),
(86725657261, 'C', '3PO', 'human_cyborg_relations@aol.com', 0),
(96734244380, 'Lando', 'Calrissian', 'cloud_city@hotmail.com', 0),
(97689531333, 'Ben', 'Kenobi', 'hello-there@hotmail.com', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Comment`
--
ALTER TABLE `Comment`
  ADD PRIMARY KEY (`commentId`),
  ADD KEY `fk_planIdComment` (`planId`),
  ADD KEY `fk_userId_comment` (`userId`);

--
-- Indexes for table `Course`
--
ALTER TABLE `Course`
  ADD PRIMARY KEY (`courseId`),
  ADD UNIQUE KEY `courseName` (`courseName`,`courseCode`);

--
-- Indexes for table `Notification`
--
ALTER TABLE `Notification`
  ADD PRIMARY KEY (`notificationId`),
  ADD KEY `fk_planIdNotification` (`planId`),
  ADD KEY `fk_userIdNotification` (`userId`);

--
-- Indexes for table `Plan`
--
ALTER TABLE `Plan`
  ADD PRIMARY KEY (`planId`),
  ADD KEY `fk_userId_plan` (`studentId`);

--
-- Indexes for table `PlanReview`
--
ALTER TABLE `PlanReview`
  ADD PRIMARY KEY (`reviewId`),
  ADD KEY `fk_planId` (`planId`),
  ADD KEY `fk_userId_review` (`userId`);

--
-- Indexes for table `RecentPlan`
--
ALTER TABLE `RecentPlan`
  ADD PRIMARY KEY (`recentId`),
  ADD UNIQUE KEY `planId` (`planId`,`userId`),
  ADD KEY `fk_userIdRecent` (`userId`);

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
  MODIFY `commentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=140;

--
-- AUTO_INCREMENT for table `Course`
--
ALTER TABLE `Course`
  MODIFY `courseId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `Notification`
--
ALTER TABLE `Notification`
  MODIFY `notificationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `Plan`
--
ALTER TABLE `Plan`
  MODIFY `planId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=424;

--
-- AUTO_INCREMENT for table `PlanReview`
--
ALTER TABLE `PlanReview`
  MODIFY `reviewId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=172;

--
-- AUTO_INCREMENT for table `RecentPlan`
--
ALTER TABLE `RecentPlan`
  MODIFY `recentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=664;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Comment`
--
ALTER TABLE `Comment`
  ADD CONSTRAINT `fk_planIdComment` FOREIGN KEY (`planId`) REFERENCES `Plan` (`planId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_userId_comment` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Notification`
--
ALTER TABLE `Notification`
  ADD CONSTRAINT `fk_planIdNotification` FOREIGN KEY (`planId`) REFERENCES `Plan` (`planId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_userIdNotification` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Plan`
--
ALTER TABLE `Plan`
  ADD CONSTRAINT `fk_userId_plan` FOREIGN KEY (`studentId`) REFERENCES `User` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `PlanReview`
--
ALTER TABLE `PlanReview`
  ADD CONSTRAINT `fk_planId` FOREIGN KEY (`planId`) REFERENCES `Plan` (`planId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_userId_review` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `RecentPlan`
--
ALTER TABLE `RecentPlan`
  ADD CONSTRAINT `fk_planIdRecent` FOREIGN KEY (`planId`) REFERENCES `Plan` (`planId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_userIdRecent` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `SelectedCourse`
--
ALTER TABLE `SelectedCourse`
  ADD CONSTRAINT `fk_courseId` FOREIGN KEY (`courseId`) REFERENCES `Course` (`courseId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_planIdCourse` FOREIGN KEY (`planId`) REFERENCES `Plan` (`planId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

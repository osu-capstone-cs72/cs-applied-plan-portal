-- phpMyAdmin SQL Dump
-- version 4.7.1
-- https://www.phpmyadmin.net/
--
-- Host: sql3.freesqldatabase.com
-- Generation Time: Jan 11, 2020 at 08:32 PM
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
  `time` time NOT NULL,
  `text` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Course`
--

CREATE TABLE `Course` (
  `courseId` int(11) NOT NULL,
  `credits` int(11) NOT NULL,
  `courseName` varchar(100) NOT NULL,
  `courseCode` varchar(8) NOT NULL,
  `courseUrl` varchar(300) NOT NULL,
  `restriction` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Course`
--

INSERT INTO `Course` (`courseId`, `credits`, `courseName`, `courseCode`, `courseUrl`, `restriction`) VALUES
(1, 4, 'Computers: Applications and Implications', 'CS101', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?subject=CS&coursenumber=101&termcode=all', 0),
(2, 4, 'Data Structures', 'CS261', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?subject=CS&coursenumber=261&termcode=all', 1),
(3, 4, 'Computer Architecture and Assembly Language', 'CS271', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?subject=CS&coursenumber=271&termcode=all', 1),
(4, 4, 'Web Development', 'CS290', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?subject=CS&coursenumber=290&termcode=all', 1),
(5, 3, 'Introduction to Theory of Computation', 'CS321', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?subject=CS&coursenumber=321&termcode=all', 0),
(6, 3, 'Social and Ethical Issues in Computer Science', 'CS391', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?subject=CS&coursenumber=391&termcode=all', 1),
(7, 4, 'Introduction to Parallel Programming', 'CS475', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?subject=CS&coursenumber=475&termcode=all', 0),
(8, 4, 'Analysis of Algorithm', 'CS325', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?subject=CS&coursenumber=325&termcode=all', 1),
(9, 4, 'Introduction to Digital Forensics', 'CS477', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?subject=CS&coursenumber=477&termcode=all', 0),
(10, 4, 'Mobile Software Development', 'CS492', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?subject=CS&coursenumber=492&termcode=all', 0),
(11, 4, 'Cloud Application Development', 'CS493', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?subject=CS&coursenumber=493&termcode=all', 0),
(12, 4, 'Data Science Tools and Programming', 'CS512', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?subject=CS&coursenumber=512&termcode=all', 2),
(13, 4, 'Introduction to Parallel Programming', 'CS575', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?subject=CS&coursenumber=575&termcode=all', 2),
(14, 4, 'Introductory Biology I', 'BI204', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?subject=BI&coursenumber=204&termcode=all', 0),
(15, 4, 'Introductory Biology II', 'BI205', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?termcode=all&coursenumber=205&subject=BI', 0),
(16, 4, 'Introductory Biology III', 'BI206', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?termcode=all&coursenumber=206&subject=BI', 0),
(17, 4, 'Introduction to Plant Biology ', 'BOT220', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?termcode=all&coursenumber=220&subject=BOT', 0),
(18, 3, 'Chemistry for Engineering Majors', 'CH201', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?termcode=all&coursenumber=201&subject=CH', 0),
(19, 4, 'General Chemistry', 'CH232', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?termcode=all&coursenumber=232&subject=CH', 0),
(20, 3, 'Interpersonal Communication', 'COMM218', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?termcode=all&coursenumber=218&subject=COMM', 0),
(21, 4, 'Introduction to the Complexity of Oregon Cropping Systems', 'CROP280', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?termcode=all&coursenumber=280&subject=CROP', 0),
(22, 4, 'The New American Cinema', 'FILM245', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?termcode=all&coursenumber=245&subject=FILM', 0),
(23, 3, 'Field Sampling of Fish and Wildlife', 'FW255', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?termcode=all&coursenumber=255&subject=FW', 0),
(24, 4, 'Forest Biology', 'FES240', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?termcode=all&coursenumber=240&subject=FES', 0),
(25, 4, 'Environmental Geology', 'GEO221', 'https://ecampus.oregonstate.edu/soc/ecatalog/ecoursedetail.htm?termcode=all&coursenumber=221&subject=GEO', 0);

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
  ADD PRIMARY KEY (`userId`);

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
  MODIFY `planId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=199;
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

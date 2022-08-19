CREATE TABLE ERS_SCHEDULE_DELIVERY
(
   DELIVERY_NAME varchar(50),
   GROUP_NAME varchar(50),
   SETTING varchar(1000)
);

CREATE TABLE ERS_SCHEDULE_TASK
(
   TASK_NAME varchar(50) PRIMARY KEY NOT NULL,
   GROUP_NAME varchar(50),
   REQUEST varchar(1024)
);

CREATE TABLE ERS_SCHEDULE_TASKGROUP
(   GROUP_NAME varchar(50) PRIMARY KEY NOT NULL,
   SCHEDULE varchar(1000),
   STARTTIME timestamp ,
   ENDTYPE varchar(100),
   ENDOPTION varchar(100),
   DESCRIPTION varchar(1024),
   ENABLE decimal(1)
);

CREATE TABLE ERS_SCHEDULE_TASKHISTORY
(
   GROUP_NAME varchar(50) NOT NULL,
   LASTUPDATEDATE timestamp  NOT NULL,
   STATUS decimal(2),
   DESCRIPTION varchar(1024)
);

import React from "react";
import { Button, Form, Space, Steps } from "antd";
import { useNavigate } from "react-router-dom";
import { useStepMasterData } from "../hooks/scheduleInput.hooks";
import StepTimeRequirement from "../components/timeRequirement";
import { StepRooms } from "../components/room";
import { StepSubjects } from "../components/subject";
import { StepLecturers } from "../components/lecture";
import { StepBatches } from "../components/batch";
import { useScheduleStore } from "../stores/useScheduleStore";
import { useOptimizedSchedule } from "../hooks/generateSchedule.hooks";
import {
  room,
  timeRequirement as timeReq,
  lecturer,
  classSubject,
  studentMajor
} from "../data.mock";

const { Step } = Steps;

const roomTypes = ["Teori", "Lab Komputer"];

export const StepMasterData: React.FC = () => {
  const navigate = useNavigate()
  const setSchedule = useScheduleStore((state) => state.setSchedule);

  const {
    currentStep,
    next,
    prev,
    rooms,
    subjects,
    lecturers,
    batches,
    addRoom,
    addSubject,
    addLecturer,
    addBatch,
    subjectOptions,
    timeRequirement,
    addTimeRequirement,
    dayOptions
  } = useStepMasterData();

  const {
    generateSchedule
  } = useOptimizedSchedule();

  const [roomForm] = Form.useForm();
  const [subjectForm] = Form.useForm();
  const [lecturerForm] = Form.useForm();
  const [batchForm] = Form.useForm();

  const stepContent = [
    // Time
    <StepTimeRequirement
      key="time"
      timeRequirement={timeRequirement}
      setTimeRequirement={addTimeRequirement} 
    />,
    // Rooms
    <StepRooms
      roomForm={roomForm}
      rooms={rooms}
      addRoom={addRoom}
      roomTypes={roomTypes}
    />,
    // Subjects
    <StepSubjects
      subjectForm={subjectForm}
      subjects={subjects}
      addSubject={addSubject}
      roomTypes={roomTypes}
    />,
    // Lecturer
    <StepLecturers
      lecturerForm={lecturerForm}
      lecturers={lecturers}
      addLecturer={addLecturer}
      subjectOptions={subjectOptions}
      dayOptions={dayOptions}
    />,
    // Batches
    <StepBatches
      batchForm={batchForm}
      batches={batches}
      addBatch={addBatch}
      subjectOptions={subjectOptions}
    />,
  ];

  const handleFinish = () => {
    // const generated = generateSchedule({
    //   rooms,
    //   subjects,
    //   lecturers,
    //   students: batches,
    //   timeReq: timeRequirement,
    // });

    // Data Mock
    const generated = generateSchedule({
      rooms: room,
      subjects: classSubject,
      lecturers: lecturer,
      students: studentMajor,
      timeReq: timeReq,
    });
    console.log("Gak bisa: ", generated.unscheduledSubjects)
    console.log("Bisa: ", generated.scheduledResults)
    setSchedule(generated.scheduledResults);
    navigate("/result"); 
  };

  return (
    <div style={{ margin: '3rem 20rem'}}>
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="Time Requirement" />
        <Step title="Rooms" />
        <Step title="Subjects" />
        <Step title="Lecturers" />
        <Step title="Batches" />
      </Steps>

      <div style={{ minHeight: 400 }}>{stepContent[currentStep]}</div>

      <Space style={{ marginTop: 24 }}>
        {currentStep > 0 && (
          <Button onClick={prev}>
            Previous
          </Button>
        )}
        {currentStep < stepContent.length - 1 && (
          <Button type="primary" onClick={next}>
            Next
          </Button>
        )}
        {currentStep === stepContent.length - 1 && (
          <Button type="primary" onClick={handleFinish}>
            Finish
          </Button>
        )}
      </Space>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { Button, Form, Row, Col, Space, Steps, message } from "antd";
import StepTimeRequirement from "../../components/timeRequirement";
import { StepBatches } from "../../components/batch";
import { useStepMasterData } from "../../hooks/scheduleInput.hooks";
import { useScheduleStore } from "../../stores/useScheduleStore";
import { useOptimizedSchedule } from "../../hooks/generateSchedule.hooks";
import { Room, Subject, Lecturer } from "../../types";

const { Step } = Steps;

interface ScheduleStepFormProps {
  onCancel: () => void;
  onSubmit: (result: any) => void;
}

export const ScheduleStepForm: React.FC<ScheduleStepFormProps> = ({ onCancel, onSubmit }) => {
  const setSchedule = useScheduleStore((state) => state.setSchedule);

  const {
    currentStep,
    next,
    prev,
    batches,
    addBatch,
    subjectOptions,
    timeRequirement,
    addTimeRequirement
  } = useStepMasterData();

  const { generateSchedule } = useOptimizedSchedule();

  const [batchForm] = Form.useForm();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);

  // Fetch master data on mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [roomRes, subjectRes, lecturerRes] = await Promise.all([
          fetch("http://localhost:5000/room"),
          fetch("http://localhost:5000/classSubject"),
          fetch("http://localhost:5000/lecturer"),
        ]);

        const [roomData, subjectData, lecturerData] = await Promise.all([
          roomRes.json(),
          subjectRes.json(),
          lecturerRes.json(),
        ]);

        setRooms(roomData);
        setSubjects(subjectData);
        setLecturers(lecturerData);
      } catch (error) {
        message.error("Gagal mengambil data master dari server.");
        console.error(error);
      }
    };

    fetchMasterData();
  }, []);

  const handleFinish = async () => {
    try {
      const generated = generateSchedule({
        rooms,
        subjects,
        lecturers,
        students: batches,
        timeReq: timeRequirement,
      });
      console.log("Generated: ", generated)
      const payload = {
        semester: timeRequirement.semester,
        schedule: JSON.stringify(generated.scheduledResults),
      };

      const res = await fetch("http://localhost:5000/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save schedule");
      setSchedule(generated.scheduledResults)
      message.success("Jadwal berhasil disimpan.");
      onSubmit(generated.scheduledResults);
    } catch (err) {
      console.error("Error saat simpan:", err);
      message.error("Gagal generate/simpan jadwal.");
    }
  };


  const stepContent = [
    <StepTimeRequirement
      key="time"
      timeRequirement={timeRequirement}
      setTimeRequirement={addTimeRequirement}
    />,
    <StepBatches
      key="batches"
      batchForm={batchForm}
      batches={batches}
      addBatch={addBatch}
      subjectOptions={subjectOptions}
    />,
  ];

  return (
    <div style={{ margin: '3rem 2rem' }}>
      <Row gutter={32}>
        <Col span={6}>
          <Steps current={currentStep} direction="vertical">
            <Step title="Time Management" style={{ marginBottom: 24 }} />
            <Step title="Batches" style={{ marginBottom: 24 }} />
          </Steps>
        </Col>
        <Col span={18}>
          <div style={{ minHeight: 400 }}>{stepContent[currentStep]}</div>

          <Space style={{ marginTop: 24 }}>
            <Button onClick={onCancel}>Cancel</Button>
            {currentStep > 0 && <Button onClick={prev}>Previous</Button>}
            {currentStep < stepContent.length - 1 && (
              <Button type="primary" onClick={next}>Next</Button>
            )}
            {currentStep === stepContent.length - 1 && (
              <Button type="primary" onClick={handleFinish}>Generate</Button>
            )}
          </Space>
        </Col>
      </Row>
    </div>
  );
};

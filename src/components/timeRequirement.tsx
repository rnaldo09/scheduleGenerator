import React from "react";
import { Form, InputNumber, Select, Input, Row, Col } from "antd";

interface Props {
  timeRequirement: any;
  setTimeRequirement: (val: any) => void;
}

const daysOptions = [
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
  { label: "Sunday", value: "sunday" },
];

const StepTimeRequirement: React.FC<Props> = ({
  timeRequirement,
  setTimeRequirement,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue(timeRequirement);
  }, [timeRequirement, form]);

  const onValuesChange = (_: any, allValues: any) => {
    setTimeRequirement(allValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={onValuesChange}
      initialValues={timeRequirement}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item 
            label="Start Time" 
            name="startTime" 
            rules={[{ required: true }]}
          >
            <Input 
              placeholder="07.00" 
              type="time" 
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item 
            label="End Time" 
            name="endTime" 
            rules={[{ required: true }]}
          >
            <Input 
              placeholder="18.00" 
              type="time" 
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Class Duration Total (minutes)"
            name="classDuration"
            rules={[{ required: true }]}
          >
            <InputNumber 
              min={30} 
              max={240} 
              style={{ width: "100%" }} 
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Break Duration (minutes)"
            name="breakDuration"
            rules={[{ required: true }]}
          >
            <InputNumber 
              min={5} 
              max={60} 
              style={{ width: "100%" }} 
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Max Courses Per Day"
            name="maxCoursesPerDay"
            rules={[{ required: true }]}
          >
            <InputNumber 
              min={1} 
              max={10} 
              style={{ width: "100%" }} 
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item 
            label="Days" 
            name="day" 
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              options={daysOptions}
              placeholder="Select days"
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={12}>
        <Form.Item
          label="Conditions"
          name="conditions"
          tooltip="Use format: day|condition|value (e.g., friday|!=|12.00)"
        >
          <Input
            placeholder="e.g., friday|!=|12.00"
          />
        </Form.Item>
      </Col>
      </Row>
    </Form>
  );
};

export default StepTimeRequirement;

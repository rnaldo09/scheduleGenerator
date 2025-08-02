import React, { useState, useEffect } from 'react';
import { Col, Form, Input, Modal, Row, Select, Typography } from 'antd';
import { Lecturer } from '../../types';

interface LecturerFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (lecturer: Lecturer) => void;
  editLecturer?: Lecturer; // Optional for editing
}

const { Option } = Select;

const LecturerForm: React.FC<LecturerFormProps> = ({ visible, onCancel, onSubmit, editLecturer }) => {
  const [form] = Form.useForm();
  const [subjectOptions, setSubjectOptions] = useState<any[]>([]);

  // Fetch subjects from JSON Server
  useEffect(() => {
    fetch('http://localhost:5000/classSubject') // Update with your JSON server endpoint
      .then((response) => response.json())
      .then((data) => {
        // Mapping data to match the structure required by Select component
        const options = data.map((subject: any) => ({
          value: subject.subjectCode,
          label: subject.subjectName,
        }));
        setSubjectOptions(options);
      })
      .catch((error) => console.error('Error fetching subjects:', error));

    if (editLecturer) {
      form.setFieldsValue(editLecturer);
    }
  }, [editLecturer, form]);

  const handleSubmit = (values: any) => {
    const updatedLecturer = {
      ...values,
      id: editLecturer?.id
    }
    onSubmit(updatedLecturer);
    form.resetFields(); // Reset form after submission
    onCancel()
  };

  return (
    <Modal
      visible={visible}
      title={editLecturer ? 'Edit Lecturer' : 'Create Lecturer'}
      okText={editLecturer ? 'Update' : 'Create'}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="lecturerId"
              label="Lecturer ID"
              rules={[{ required: true }]}
            >
              <Input placeholder="Input lecturer id" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lecturerName"
              label="Lecturer Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Input lecturer name" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="subject"
          label="Subject"
          rules={[{ required: true }]}
        >
          <Select
            mode="multiple"
            options={subjectOptions}
            placeholder="Select subject(s)"
          />
        </Form.Item>
        <Form.Item
          name="availability"
          label="Availability"
          rules={[{ required: true }]}
        >
          <Select mode="multiple" placeholder="Select day(s) available">
            {/* Assuming you have a list of days */}
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
              <Option key={day} value={day}>
                {day.charAt(0).toUpperCase() + day.slice(1)} {/* Capitalize first letter */}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="conditions"
          label="Conditions (comma separated)"
          tooltip={{
            title: (
              <>
                <Typography.Text type="secondary">{`Use format {variable}|{condition}|{value}`}</Typography.Text>
                <br />
                <Typography.Text type="secondary">
                  Example: <code>monday|=|morning</code> for request for Monday morning
                </Typography.Text>
              </>
            ),
            overlayStyle: { backgroundColor: 'white !important' }, // Tooltip background set to white
          }}
        >
          <Input placeholder="Input special conditions" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LecturerForm;

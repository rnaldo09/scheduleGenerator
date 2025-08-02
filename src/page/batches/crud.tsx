import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, InputNumber, Row, Col } from 'antd';
import { Batch } from '../../types';

interface BatchesFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (batch: Batch) => void;
  editBatch?: Batch; // Optional for editing
}

const BatchesForm: React.FC<BatchesFormProps> = ({ visible, onCancel, onSubmit, editBatch }) => {
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

    if (editBatch) {
      form.setFieldsValue(editBatch);
    }
  }, [editBatch, form]);

  const handleSubmit = (values: any) => {
    const updatedBatches = {
      ...values,
      id: editBatch?.id
    }
    onSubmit(updatedBatches);
    form.resetFields(); // Reset form after submission
  };

  return (
    <Modal
      visible={visible}
      title={editBatch ? 'Edit Batch' : 'Create Batch'}
      okText={editBatch ? 'Update' : 'Create'}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="batchId" 
              label="Batch ID" 
              rules={[{ required: true }]}
            > 
              <Input
                placeholder="Input batch id" 
              /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="batchName" 
              label="Batch Name" 
              rules={[{ required: true }]}
            > 
              <Input 
                placeholder="Input batch name" 
              /> 
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="major" 
              label="Major" 
              rules={[{ required: true }]}
            > 
              <Input 
                placeholder="Input major"
              /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="batchYear" 
              label="Batch Year" 
              rules={[{ 
                required: true, 
                type: "number" 
              }]}
            > 
              <InputNumber 
                min={2000} 
                max={2100}
                placeholder="Input batch year"
                style={{ width: '100%' }} 
              /> 
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item 
              name="amount" 
              label="Student Amount" 
              rules={[{ 
                required: true, 
                type: "number" 
              }]}
            > 
              <InputNumber 
                min={1}
                placeholder="Input student amount"
                style={{ width: '100%' }} 
              /> 
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default BatchesForm;

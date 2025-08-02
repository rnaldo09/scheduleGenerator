import React, { useEffect } from 'react';
import { Col, Form, Input, Modal, Row, Select, Switch } from 'antd';
import { Subject } from '../../types';

interface ClassSubjectFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (classSubject: Subject) => void;
  editClassSubject?: Subject; // Optional for editing
}

const { Option } = Select;

const ClassSubjectForm: React.FC<ClassSubjectFormProps> = ({ visible, onCancel, onSubmit, editClassSubject }) => {
  const [form] = Form.useForm();

  // Prefill form if editing
  useEffect(() => {
    if (editClassSubject) {
      form.setFieldsValue(editClassSubject);
    }
  }, [editClassSubject, form]);

  const handleSubmit = (values: any) => {
    const updatedSubject = {
      ...values,
      id: editClassSubject?.id
    }
    onSubmit(updatedSubject);
    form.resetFields(); // Reset form after submission
    onCancel()
  };

  return (
    <Modal
      visible={visible}
      title={editClassSubject ? 'Edit Class Subject' : 'Create Class Subject'}
      okText={editClassSubject ? 'Update' : 'Create'}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="subjectCode" 
              label="Subject Code" 
              rules={[{ required: true }]}
            > 
              <Input placeholder="Input subject code" /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="subjectName" 
              label="Subject Name" 
              rules={[{ required: true }]}
            > 
              <Input placeholder="Input subject name" /> 
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="roomType" 
              label="Room Type" 
              rules={[{ required: true }]}

            > 
              <Select placeholder="Select room type">
                <Option value="Teori">Teori</Option>
                <Option value="Lab Komputer">Lab Komputer</Option>
              </Select> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="tandem" 
              label="Tandem" 
              valuePropName="checked"  // This is important for Switch
              initialValue={false}
              labelCol={{ span: 10 }} // Adjust label column width
              wrapperCol={{ span: 14 }} // Adjust wrapper column width
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ClassSubjectForm;

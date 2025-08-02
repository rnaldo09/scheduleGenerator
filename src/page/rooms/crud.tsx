import React, { useEffect } from 'react';
import { Form, Input, Modal, Select, InputNumber, Row, Col } from 'antd';
import { Room } from '../../types';

interface RoomFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (room: Room) => void;
  editRoom?: Room; // Optional for editing
}

const { Option } = Select;

const RoomForm: React.FC<RoomFormProps> = ({ visible, onCancel, onSubmit, editRoom }) => {
  const [form] = Form.useForm();

  // Prefill the form with room data if we're editing
  useEffect(() => {
    if (editRoom) {
      // Ensure that facilities are stored as an array and set the values correctly
      const facilities = editRoom.facility ? editRoom.facility.join(', ') : '';
      form.setFieldsValue({
        ...editRoom,
        facility: facilities, // Convert facility to a comma-separated string for display
      });
    }
  }, [editRoom, form]);

  const handleSubmit = (values: any) => {
    // Convert facilities input back to array
    const updatedRoom = {
      ...values,
      facility: values.facility.split(',').map((f: string) => f.trim()), // Split by commas and trim spaces
      id: editRoom?.id
    };
    onSubmit(updatedRoom);
    form.resetFields(); // Reset form after submission
    onCancel(); // Close modal
  };

  return (
    <Modal
      visible={visible}
      title={editRoom ? 'Edit Room' : 'Create Room'}
      okText={editRoom ? 'Update' : 'Create'}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="roomCode" 
              label="Room Code" 
              rules={[{ required: true }]}
            > 
              <Input 
                placeholder="Input room code" 
                disabled={editRoom !== undefined} // Disable editing if it's an edit action
              /> 
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="roomName" 
              label="Room Name" 
              rules={[{ required: true }]}
            > 
              <Input 
                placeholder="Input room name" 
              /> 
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item 
              name="capacity" 
              label="Capacity" 
              rules={[{ required: true, type: "number", min: 1 }]}
            > 
              <InputNumber 
                min={1} 
                style={{width: '100%'}}
                placeholder="Input room capacity"
              /> 
            </Form.Item>
          </Col>
          <Col span={6}>
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
              name="facility" 
              label="Facilities (comma separated)"
            > 
              <Input 
                placeholder="Input facilities on room" 
              /> 
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default RoomForm;
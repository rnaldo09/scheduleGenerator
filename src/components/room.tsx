import { Form, Input, InputNumber, Select, Button, Table, Row, Col } from "antd";

const { Option } = Select;

export const StepRooms = ({ roomForm, addRoom, rooms, roomTypes }: any) => (
  <div>
    <Form
      form={roomForm}
      layout="vertical"
      onFinish={(values) => {
        addRoom(values);
        roomForm.resetFields();
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item 
            name="roomCode" 
            label="Room Code" 
            rules={[{ required: true }]}
          > 
            <Input 
              placeholder="Input room code" 
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
            rules={[{ 
              required: true, 
              type: "number", 
              min: 1 
            }]}
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
            <Select
              placeholder="Select room type"
            > 
              {roomTypes.map(
                (rt: string) => (<Option key={rt} value={rt}>{rt}</Option>)
              )} 
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
      <Form.Item> 
        <Button 
          type="primary" 
          htmlType="submit"
        >
          Add Room
        </Button> 
      </Form.Item>
    </Form>

    <Table
      dataSource={rooms.map((r: any, i: number) => ({ ...r, key: i }))}
      columns={[
        { title: "Room Code", dataIndex: "roomCode" },
        { title: "Room Name", dataIndex: "roomName" },
        { title: "Capacity", dataIndex: "capacity" },
        { title: "Room Type", dataIndex: "roomType" },
        {
          title: "Facilities",
          dataIndex: "facility",
          render: (facilities: string[]) => facilities?.length ? facilities.join(", ") : "-",
        },
      ]}
      pagination={false}
      style={{ marginTop: 16 }}
    />
  </div>
);
import { Form, Input, Select, Button, Table, Row, Col } from "antd";

const { Option } = Select;

export const StepSubjects = ({ subjectForm, addSubject, subjects, roomTypes }: any) => (
  <div>
    <Form
      form={subjectForm}
      layout="vertical"
      onFinish={(values) => {
        addSubject(values);
        subjectForm.resetFields();
      }}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item 
            name="subjectCode" 
            label="Subject Code" 
            rules={[{ required: true }]}
          > 
            <Input
              placeholder="Input subject code" 
            /> 
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item 
            name="subjectName" 
            label="Subject Name" 
            rules={[{ required: true }]}
          > 
            <Input
              placeholder="Input subject name" 
            /> 
          </Form.Item>
        </Col>
        <Col span={8}>
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
      </Row>
      <Form.Item> 
        <Button 
          type="primary" 
          htmlType="submit"
        >
          Add Subject
        </Button> 
      </Form.Item>
    </Form>

    <Table
      dataSource={subjects.map((s: any, i: number) => ({ ...s, key: i }))}
      columns={[
        { title: "Subject Code", dataIndex: "subjectCode" },
        { title: "Subject Name", dataIndex: "subjectName" },
        { title: "Room Type", dataIndex: "roomType" },
      ]}
      pagination={false}
      style={{ marginTop: 16 }}
    />
  </div>
);
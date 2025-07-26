import { Form, Input, InputNumber, Select, Button, Table, Row, Col } from "antd";

export const StepBatches = ({ batchForm, addBatch, batches, subjectOptions }: any) => (
  <div>
    <Form
      form={batchForm}
      layout="vertical"
      onFinish={(values) => {
        addBatch(values);
        batchForm.resetFields();
      }}
    >
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
        <Col span={6}>
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
        <Col span={6}>
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
      <Form.Item 
        name="subjectEnroll" 
        label="Subject Enroll" 
        rules={[{ required: true }]}
      > 
        <Select 
          mode="multiple" 
          options={subjectOptions} 
          placeholder="Select subject(s)" 
        /> 
      </Form.Item>
      <Form.Item> 
        <Button 
          type="primary" 
          htmlType="submit"
        > 
          Add Batch
        </Button> 
      </Form.Item>
    </Form>

    <Table
      dataSource={batches.map((b: any, i: number) => ({ ...b, key: i }))}
      columns={[
        { title: "Batch ID", dataIndex: "batchId" },
        { title: "Batch Name", dataIndex: "batchName" },
        { title: "Major", dataIndex: "major" },
        { title: "Year", dataIndex: "batchYear" },
        { title: "Amount", dataIndex: "amount" },
        {
          title: "Subjects Enrolled",
          dataIndex: "subjectEnroll",
          render: (subs: string[]) => subs?.length ? subs.join(", ") : "-",
        },
      ]}
      pagination={false}
      style={{ marginTop: 16 }}
    />
  </div>
);
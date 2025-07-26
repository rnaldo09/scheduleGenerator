import { Form, Input, Select, Button, Table, Row, Col, Typography } from "antd";
import { Day } from "../types";

const { Option } = Select;

export const StepLecturers = ({ lecturerForm, addLecturer, lecturers, subjectOptions, dayOptions }: any) => (
  <div>
    <Form
      form={lecturerForm}
      layout="vertical"
      onFinish={(values) => {
        addLecturer(values);
        lecturerForm.resetFields();
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item 
            name="lecturerId" 
            label="Lecturer ID" 
            rules={[{ required: true }]}
          > 
            <Input
              placeholder="Input lecturer id" 
            /> 
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item 
            name="lecturerName" 
            label="Lecturer Name" 
            rules={[{ required: true }]}
          > 
            <Input
              placeholder="Input lecturer name" 
            /> 
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
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
        </Col>
        <Col span={12}>
          <Form.Item 
            name="availability" 
            label="Availability" 
            rules={[{ required: true }]}
          > 
            <Select 
              mode="multiple"
              placeholder="Select day(s) avaiable"
            > 
              {dayOptions.map(
                (day: Day) => (
                  <Option key={day} value={day}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </Option>
                )
              )} 
            </Select> 
          </Form.Item>
        </Col>
      </Row>
      <Form.Item 
        name="conditions" 
        label="Conditions (comma separated)"
        tooltip={
          <>
            <Typography.Text type="secondary">{`Use format {variable}|{condition}|{value}`}</Typography.Text><br />
            <Typography.Text type="secondary">Example: <code>monday|=|morning</code> for request for Monday morning</Typography.Text>
          </>
        }
      > 
        <Input 
          placeholder="Input special conditions" 
        /> 
      </Form.Item>
      <Form.Item> 
        <Button 
          type="primary" 
          htmlType="submit"
        >
          Add Lecturer
        </Button> 
      </Form.Item>
    </Form>

    <Table
      dataSource={lecturers.map((l: any, i: number) => ({ ...l, key: i }))}
      columns={[
        { title: "Lecturer ID", dataIndex: "lecturerId" },
        { title: "Name", dataIndex: "lecturerName" },
        {
          title: "Subjects",
          dataIndex: "subject",
          render: (subs: string[]) => (subs && subs.length ? subs.join(", ") : "-"),
        },
        {
          title: "Availability",
          dataIndex: "availability",
          render: (days: Day[]) => days?.length ? days.map((d) => d.charAt(0).toUpperCase() + d.slice(1)).join(", ") : "-",
        },
        {
          title: "Conditions",
          dataIndex: "conditions",
          render: (conds: string[]) => conds?.length ? conds.join(", ") : "-",
        },
      ]}
      pagination={false}
      style={{ marginTop: 16 }}
    />
  </div>
);
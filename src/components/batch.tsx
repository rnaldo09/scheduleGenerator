import React, { useEffect, useState } from "react";
import {
  Form,
  Select,
  Table,
  Button,
  Row,
  Col,
  message,
  InputNumber,
  Input,
  Tag,
  Space,
} from "antd";

export const StepBatches = ({ batches, addBatch }: any) => {
  const [form] = Form.useForm();
  const [batchList, setBatchList] = useState<any[]>([]);
  const [subjectList, setSubjectList] = useState<any[]>([]);
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
  const [localBatches, setLocalBatches] = useState<any[]>(batches);

  // Sync ke parent setiap kali local berubah
  useEffect(() => {
    addBatch(localBatches);
  }, [localBatches]);

  // Fetch batch and subject data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [batchRes, subjectRes] = await Promise.all([
          fetch("http://localhost:5000/studentMajor"),
          fetch("http://localhost:5000/classSubject"),
        ]);
        const [batchData, subjectData] = await Promise.all([
          batchRes.json(),
          subjectRes.json(),
        ]);
        setBatchList(batchData);
        setSubjectList(subjectData);
      } catch (err) {
        console.error(err);
        message.error("Failed to fetch batch or subject data.");
      }
    };

    fetchData();
  }, []);

  const handleFinish = (values: any) => {
    const selectedBatch = batchList.find((b) => b.batchId === values.batchId);
    if (!selectedBatch) return;

    const batchData = {
      ...selectedBatch,
      subjectEnroll: values.subjectEnroll,
    };

    // Jika sedang edit
    if (editingBatchId) {
      setLocalBatches((prev) =>
        prev.map((b) => (b.batchId === editingBatchId ? batchData : b))
      );
      message.success("Batch updated.");
      setEditingBatchId(null);
    } else {
      if (localBatches.some((b: any) => b.batchId === values.batchId)) {
        message.warning("Batch already added.");
        return;
      }
      setLocalBatches([...localBatches, batchData]);
      message.success("Batch added.");
    }

    form.resetFields();
  };

  const handleEdit = (batchId: string) => {
    const selected = localBatches.find((b) => b.batchId === batchId);
    if (!selected) return;

    setEditingBatchId(batchId);
    form.setFieldsValue({
      batchId: selected.batchId,
      batchName: selected.batchName,
      major: selected.major,
      batch: selected.batchYear ?? selected.batch, // fallback
      amount: selected.amount,
      subjectEnroll: selected.subjectEnroll,
    });
  };

  const handleDelete = (batchId: string) => {
    setLocalBatches((prev) => prev.filter((b) => b.batchId !== batchId));
    if (editingBatchId === batchId) {
      setEditingBatchId(null);
      form.resetFields();
    }
  };

  const clearAll = () => {
    setLocalBatches([]);
    form.resetFields();
    setEditingBatchId(null);
  };

  return (
    <div>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="batchId"
              label="Batch"
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                placeholder="Select batch"
                options={batchList
                  .sort((a, b) => a.batchName.localeCompare(b.batchName))
                  .map((b) => ({
                    label: `${b.batchName} (${b.batchYear})`,
                    value: b.batchId,
                  }))}
                onChange={(val) => {
                  const selected = batchList.find((b) => b.batchId === val);
                  if (selected) {
                    form.setFieldsValue({
                      batchName: selected.batchName,
                      major: selected.major,
                      batch: selected.batchYear,
                      amount: selected.amount,
                    });
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="subjectEnroll"
              label="Subject Enroll"
              rules={[{ required: true }]}
            >
              <Select
                mode="multiple"
                placeholder="Select subjects"
                options={subjectList
                  .sort((a, b) => a.subjectName.localeCompare(b.subjectName))
                  .map((s) => ({
                    label: `${s.subjectCode} - ${s.subjectName}`,
                    value: s.subjectCode,
                  }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="batchName" label="Batch Name">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="major" label="Major">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="batch" label="Year">
              <InputNumber disabled style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="amount" label="Student Amount">
              <InputNumber disabled style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {editingBatchId ? "Update Batch" : "Add Batch"}
            </Button>
            {localBatches.length > 0 && (
              <Button danger onClick={clearAll}>
                Clear All
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>

      <Table
        dataSource={localBatches.map((b: any, i: number) => ({ ...b, key: i }))}
        columns={[
          { title: "Batch ID", dataIndex: "batchId" },
          { title: "Batch Name", dataIndex: "batchName" },
          { title: "Major", dataIndex: "major" },
          { title: "Year", dataIndex: "batchYear" },
          { title: "Amount", dataIndex: "amount" },
          {
            title: "Subjects Enrolled",
            dataIndex: "subjectEnroll",
            render: (subs: string[]) =>
              subs?.length ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {subs.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              ) : (
                "-"
              ),
          },
          {
            title: "Action",
            render: (_: any, record: any) => (
              <Space>
                <Button onClick={() => handleEdit(record.batchId)}>Edit</Button>
                <Button danger onClick={() => handleDelete(record.batchId)}>
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
        pagination={false}
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

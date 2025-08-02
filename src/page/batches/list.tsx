import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message } from 'antd';
import BatchesForm from './crud';
import { Batch } from '../../types';

const BatchesTable: React.FC = () => {
  const [data, setData] = useState<Batch[]>([]);
  const [visible, setVisible] = useState(false);
  const [editBatch, setEditBatch] = useState<Batch | null>(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    const response = await fetch('http://localhost:5000/studentMajor');
    const result = await response.json();
    setData(result);
  };

  const handleCreate = async (batch: Batch) => {
    const response = await fetch('http://localhost:5000/studentMajor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batch),
    });
    if (response.ok) {
      message.success('Batch created successfully');
      fetchBatches();
      setVisible(false);
    }
  };

  const handleEdit = async (batch: Batch) => {
    const response = await fetch(`http://localhost:5000/studentMajor/${batch.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batch),
    });
    if (response.ok) {
      message.success('Batch updated successfully');
      fetchBatches();
      setVisible(false);
    }
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`http://localhost:5000/studentMajor/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      message.success('Batch deleted successfully');
      fetchBatches();
    }
  };

  const columns = [
    {
      title: 'Batch ID',
      dataIndex: 'batchId',
      key: 'batchId',
    },
    {
      title: 'Batch Name',
      dataIndex: 'batchName',
      key: 'batchName',
    },
    {
      title: 'Major',
      dataIndex: 'major',
      key: 'major',
    },
    {
      title: 'Batch Year',
      dataIndex: 'batchYear',
      key: 'batchYear',
    },
    {
      title: 'Amount of Students',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Batch) => (
        <Space size="middle">
          <Button onClick={() => { setEditBatch(record); setVisible(true); }}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this batch?"
            onConfirm={() => handleDelete(record.batchId)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => { setVisible(true); setEditBatch(null); }}>Create Batch</Button>
      <Table columns={columns} dataSource={data} rowKey="batchId" pagination={{ pageSize: 10 }} />
      <BatchesForm
        visible={visible}
        onCancel={() => setVisible(false)}
        onSubmit={editBatch ? handleEdit : handleCreate}
        editBatch={editBatch || undefined}
      />
    </div>
  );
};

export default BatchesTable;

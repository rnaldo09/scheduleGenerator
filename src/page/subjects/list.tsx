import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message } from 'antd';
import ClassSubjectForm from './crud';
import { Subject } from '../../types';

const ClassSubjectTable: React.FC = () => {
  const [data, setData] = useState<Subject[]>([]);
  const [visible, setVisible] = useState(false);
  const [editClassSubject, setEditClassSubject] = useState<Subject | null>(null);

  useEffect(() => {
    fetchClassSubjects();
  }, []);

  const fetchClassSubjects = async () => {
    const response = await fetch('http://localhost:5000/classSubject');
    const result = await response.json();
    setData(result);
  };

  const handleCreate = async (classSubject: Subject) => {
    const response = await fetch('http://localhost:5000/classSubject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(classSubject),
    });
    if (response.ok) {
      message.success('Class Subject created successfully');
      fetchClassSubjects();
      setVisible(false);
    }
  };

  const handleEdit = async (classSubject: Subject) => {
    const response = await fetch(`http://localhost:5000/classSubject/${classSubject.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(classSubject),
    });
    if (response.ok) {
      message.success('Class Subject updated successfully');
      fetchClassSubjects();
      setVisible(false);
    }
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`http://localhost:5000/classSubject/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      message.success('Class Subject deleted successfully');
      fetchClassSubjects();
    }
  };

  const columns = [
    {
      title: 'Subject Code',
      dataIndex: 'subjectCode',
      key: 'subjectCode',
    },
    {
      title: 'Subject Name',
      dataIndex: 'subjectName',
      key: 'subjectName',
    },
    {
      title: 'Room Type',
      dataIndex: 'roomType',
      key: 'roomType',
    },
    {
      title: 'Tandem',
      dataIndex: 'tandem',
      key: 'tandem',
      render: (text: boolean) => (text ? 'Yes' : 'No'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Subject) => (
        <Space size="middle">
          <Button onClick={() => { setEditClassSubject(record); setVisible(true); }}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this class subject?"
            onConfirm={() => handleDelete(record.subjectCode)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => { setVisible(true); setEditClassSubject(null); }}>Create Class Subject</Button>
      <Table columns={columns} dataSource={data} rowKey="subjectCode" pagination={{ pageSize: 10 }} />
      <ClassSubjectForm
        visible={visible}
        onCancel={() => setVisible(false)}
        onSubmit={editClassSubject ? handleEdit : handleCreate}
        editClassSubject={editClassSubject || undefined}
      />
    </div>
  );
};

export default ClassSubjectTable;

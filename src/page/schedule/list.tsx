import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Modal } from 'antd';
import { ScheduleStepForm } from './crud';
import RenderSchedule from './result';
import { ScheduleList } from '../../types';
import { useScheduleStore } from '../../stores/useScheduleStore';

const ScheduleTable: React.FC = () => {
  const setSchedule = useScheduleStore((state) => state.setSchedule);
  const [data, setData] = useState<ScheduleList[]>([]);
  const [createVisible, setCreateVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await fetch('http://localhost:5000/schedule');
      const result = await response.json();
      setData(result);
    } catch (error) {
      message.error('Failed to fetch schedule');
    }
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`http://localhost:5000/schedule/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      message.success('Schedule deleted successfully');
      fetchSchedule();
    }
  };

  const columns = [
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: ScheduleList) => (
        <Space size="middle">
          <Button 
            onClick={() => {
              setPreviewVisible(true)
              setSchedule(JSON.parse(record.schedule))
            }}
          >
            Preview
          </Button>
          <Popconfirm
            title="Are you sure to delete this schedule?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setCreateVisible(true)}>
        Create Schedule
      </Button>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        style={{ marginTop: 16 }}
      />

      {/* Create Schedule Modal */}
      <Modal
        title="Buat Jadwal"
        open={createVisible}
        onCancel={() => setCreateVisible(false)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
      >
        {createVisible && (
            <ScheduleStepForm
                onCancel={() => setCreateVisible(false)}
                onSubmit={() => {
                  setCreateVisible(false);
                  setPreviewVisible(true);
                }}
            />
        )}
      </Modal>

      {/* Preview Schedule Modal */}
      <Modal
        title="Preview Jadwal Terakhir"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
      >
        <RenderSchedule />
      </Modal>
    </div>
  );
};

export default ScheduleTable;

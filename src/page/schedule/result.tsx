import { useRef } from 'react';
import { Button, Select, Space, Table } from 'antd';
import { useOptimizedSchedule } from '../../hooks/generateSchedule.hooks';
import { downloadHtmlAsPdf } from '../../utils/generatePdf';
import { Batch, Lecturer, Room } from '../../types';

function RenderSchedule() {
  const tableRef = useRef<HTMLDivElement>(null);

  const { 
    columns, 
    dataSource,
    batchOptions,
    setBatchFilter,
    lecturerOptions,
    setLecturerFilter,
    roomOptions,
    setRoomFilter 
  } = useOptimizedSchedule();

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Select
          allowClear
          placeholder="Filter Batch"
          options={batchOptions.map((b: Batch) => ({ label: b, value: b }))}
          onChange={setBatchFilter}
          style={{ width: 150 }}
        />
        <Select
          allowClear
          placeholder="Filter Dosen"
          options={lecturerOptions.map((l: Lecturer) => ({ label: l, value: l }))}
          onChange={setLecturerFilter}
          style={{ width: 180 }}
        />
        <Select
          allowClear
          placeholder="Filter Ruangan"
          options={roomOptions.map((r: Room) => ({ label: r, value: r }))}
          onChange={setRoomFilter}
          style={{ width: 150 }}
        />
        <Button onClick={() => downloadHtmlAsPdf(tableRef as React.RefObject<HTMLElement>)}>
          Download Jadwal PDF
        </Button>
      </Space>
      <div ref={tableRef}>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}

export default RenderSchedule;

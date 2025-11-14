import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import socket from "../utils/socket";
import toast from "react-hot-toast";

export default function ActivityTimeline({ leadId }) {
  const [activities, setActivities] = useState([]);

  const loadActivities = async () => {
    const res = await axiosInstance.get(`/activities/${leadId}`);
    setActivities(res.data);
  };

  useEffect(() => {
    loadActivities();

    socket.on("activityCreated", (data) => {
      toast.success(data.message);
      loadActivities();
    });

    return () => socket.off("activityCreated");
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-4">
      <h3 className="text-lg font-bold mb-3">Activity Timeline</h3>

      {activities.map((a) => (
        <div key={a.id} className="border-l-2 border-blue-500 pl-3 mb-3">
          <p className="font-semibold">{a.type}</p>
          <p className="text-sm">{a.note}</p>
          <p className="text-gray-500 text-xs">
            {new Date(a.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

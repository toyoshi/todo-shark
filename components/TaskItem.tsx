// components/TaskItem.tsx
import { useState, useEffect } from 'react';
import { Task } from "../types/task";
import { updateTask, deleteTask } from '../lib/tasks';
import { updateTaskStatus } from '../lib/tasks';
import { useInterval } from '../lib/hooks';
import {
  TimeRecord,
  createTimeRecord,
  getTimeRecordsByTaskId,
  updateTimeRecord,
  getIncompleteTimeRecordByTaskId,
  getTotalTimeSpent
} from '../lib/TimeRecords';
import { fetchChatGptResponse } from "../lib/chatGpt";
import { getTaskConversations, saveTaskConversations } from '../lib/conversations';

interface TaskItemProps {
  task: Task;
  onTaskUpdated: () => void;
  selectedTaskId: number | null;
  onSelectedTaskIdChange: (taskId: number | null) => void;
}
const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskUpdated, selectedTaskId, onSelectedTaskIdChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(task.title);
  const [actualTime, setActualTime] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "gpt"; message: string }>>([]);

  const isChatVisible = task.id === selectedTaskId;

  const handleUpdate = async () => {
    if (updatedTitle.trim() === '') return;
    //await updateTask(task.id, { title: updatedTitle.trim() });
    setIsEditing(false);
    onTaskUpdated();
  };

  const handleDelete = async () => {
    if (task.id === undefined) {
      return
    }
    await deleteTask(task.id);
    onTaskUpdated();
  };

  const handleStart = async () => {
    const start_time = new Date().toISOString();
    await createTimeRecord(task.id, start_time);
    await updateTaskStatus(task.id, 'in_progress');
    onTaskUpdated();
  
    // Get the total time spent on this task and set it to actualTime state
    const totalTimeSpent = await getTotalTimeSpent(task.id);
    setActualTime(totalTimeSpent);
  
    // Start counting up
    setIsCounting(true);
  };

  const handlePause = async () => {
    const timeRecords = await getTimeRecordsByTaskId(task.id);
    
    if (timeRecords === null) {
      // エラー処理など
      return;
    }

    const currentTimeRecord = timeRecords.find((record) => !record.end_time);
    if (currentTimeRecord) {
      const end_time = new Date().toISOString();
      await updateTimeRecord(currentTimeRecord.id, { end_time });
      await updateTaskStatus(task.id, 'not_started');
      onTaskUpdated();
    }
  
    // Stop counting up
    setIsCounting(false);
  };

  const handleComplete = async () => {
    const timeRecords = await getTimeRecordsByTaskId(task.id);
    
    if (timeRecords === null) {
      // エラー処理など
      return;
    }

    const currentTimeRecord = timeRecords.find((record) => !record.end_time);
    if (currentTimeRecord) {
      const end_time = new Date().toISOString();
      await updateTimeRecord(currentTimeRecord.id, { end_time });
      await updateTaskStatus(task.id, 'completed');
      onTaskUpdated();
    }

    // Stop counting up
    setIsCounting(false);
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async () => {
    if (chatInput.trim() === "" || !isChatVisible) return;
    // Add user message to chatMessages
    setChatMessages((prevMessages) => [...prevMessages, { sender: "user", message: chatInput.trim() }]);
    setChatInput("");

    // Send user message to ChatGPT and get response (placeholder code)
    const gptResponse = await fetchChat(chatInput.trim());
    setChatMessages((prevMessages) => [...prevMessages, { sender: "gpt", message: gptResponse }]);
  };

  const fetchChat = async (userMessage: string) => {
    try {
      // メッセージ履歴を取得
      let messageHistory = await getTaskConversations(task.id)

      // メッセージ履歴が空の場合、デフォルトのメッセージを追加
      if (messageHistory.length === 0) {
        messageHistory = [{
          role: "system",
          content: `
            あなたはToDoリストの横に表示されている、タスクの消化を手助けするコーチです。
            なぜそのタスクの着手ができないのか、どういう障害があるのかといったことを探りながら、サポートしてあげてください。
            
            = 条件
            発言は短い言葉で。

            = こんな観点からサポートしてください
            ・着手で困っていることは何かありますか？最初のステップから分解しましょう
            ・勝手に心配や不安から手がつけられてないか
            ・今日中にやったほうがいいか（明日やると良くないことがあるか）
            
            = 今回のタスクの内容
            ${task.title}`,
        }];
      }

      // メッセージ履歴を含めてChatGPT APIを呼び出す
      const gptResponse = await fetchChatGptResponse(userMessage, messageHistory);

      // データベースに新しい会話を保存
      messageHistory.push({
        role: 'user',
        content: userMessage,
      })

      messageHistory.push({
        role: 'assistant',
        content: gptResponse,
      })

      await saveTaskConversations(task.id, messageHistory);

      return gptResponse;

    } catch (error) {
      console.error("Error fetching ChatGPT response:", error);
      return "Error fetching ChatGPT response. Please check the console for more information.";
    }
  };


  useEffect(() => {
    const fetchConversations = async () => {
      if (isChatVisible) {
        try {
          const conversations = await getTaskConversations(task.id);
          const formattedConversations: [] = conversations.map((conv :{ role: string; content: string }) => ({
            sender: conv.role === "user" ? "user" : "gpt",
            message: conv.content,
          }));
  
          setChatMessages(formattedConversations);
        } catch (error) {
          console.error("Error fetching task conversations:", error);
        }
      } else {
        setChatMessages([]);
      }
    };
  
    fetchConversations();
  }, [isChatVisible, task.id]);
  
  useEffect(() => {
    const fetchTotalTimeSpent = async () => {
      const totalTimeSpent = await getTotalTimeSpent(task.id);
      setActualTime(totalTimeSpent);
    };
  
    fetchTotalTimeSpent();
  }, [task.status, task.id]);

  useInterval(() => {
    if (isCounting) {
      setActualTime(actualTime + 1000);
    }
  }, 1000);


  return (
    <>
      <tr className={task.status === 'in_progress' ? 'bg-green-100' : task.status === 'completed' ? 'active' : ''}>
        <td className="px-6 py-4 whitespace-nowrap">
          {isEditing ? (
            <input
              type="text"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              onBlur={handleUpdate}
              className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            />
          ) : (
            <span className="text-gray-800">{task.title}</span>
          )}
          <button onClick={() => onSelectedTaskIdChange(task.id === selectedTaskId ? null : task.id)} className="ml-4">💬</button>
        </td>
        <td className="px-6 py-4 text-center whitespace-nowrap">
          {task.estimated_time} <span className="text-gray-500 text-xs">min</span>
        </td>
        <td className={`px-6 py-4 text-center whitespace-nowrap ${task.status === 'in_progress' ? 'font-bold' : ''}`}>
          {formatTime(actualTime)}
        </td>
        <td className="text-right">
          <div className="flex gap-2 ">
            <button
              onClick={task.status === 'not_started' ? handleStart : handlePause}
              className='btn btn-primary btn-sm'
              disabled={task.status !== 'not_started' && task.status !== 'paused'}
            >開始
            </button>
            <button
              onClick={handlePause}
              className='btn btn-secondary btn-sm'
              disabled={task.status !== 'in_progress'}
            >
              一時停止
            </button>
            <button
              onClick={handleComplete}
              className='btn btn-accent btn-sm'
              disabled={task.status === 'completed'}
            >
              終了
            </button>
            <button onClick={handleDelete} className='btn btn-sm btn-outline btn-warning'>
              削除
            </button>
          </div>

        </td>
      </tr>

      {
        isChatVisible && (
          <tr>
            <td colSpan={4}>

              <div className="mt-2 w-full">
                <div className="textarea textarea-bordered w-full whitespace-break-spaces">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`chat ${msg.sender === "user" ? "chat-end" : "chat-start"}`}>
                      <div className="chat-bubble">
                        <span className={msg.sender === "user" ? "text-blue-500" : "text-green-500"}>
                          {msg.sender === "user" ? "You" : "ChatGPT"}:
                        </span>{" "}
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full max-w-xs mt-4"
                  placeholder="Type your message"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-primary ml-5"
                  onClick={handleSendMessage}
                >
                  Send
                </button>


              </div>
            </td></tr>
        )

      }
    </>
  );
};

export default TaskItem;


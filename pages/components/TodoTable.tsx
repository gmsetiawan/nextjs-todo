import React from "react";
import { TbArrowsExchange2 } from "react-icons/tb";
import { MdOutlineModeEditOutline, MdDeleteOutline } from "react-icons/md";
import { BiTime, BiTimer } from "react-icons/bi";
import { CgSandClock } from "react-icons/cg";
import moment from "moment";

interface Todo {
  id: string;
  context: string;
  isStatus: boolean;
  created_at: string;
  updated_at: string;
}

interface TodoTableProps {
  todos: Todo[];
  handleUpdateStatus: (id: any) => Promise<void>;
  handleEdit: (todo: Todo) => void;
  handleDelete: (id: any) => Promise<void>;
}

const TodoTable: React.FC<TodoTableProps> = ({
  todos,
  handleUpdateStatus,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="w-full relative overflow-x-auto shadow-md rounded">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Todo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-600">
          {todos.map((todo) => (
            <tr key={todo.id}>
              <th
                scope="row"
                className={`px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-wrap`}
              >
                {todo.created_at === todo.updated_at &&
                todo.isStatus === false ? (
                  <h1 className="text-xs font-thin leading-6 inline-flex items-center gap-2">
                    <BiTime size={16} className="text-blue-200" />
                    <span> {moment(todo.created_at).fromNow()}</span>
                  </h1>
                ) : (
                  <div className="flex flex-col lg:flex-row whitespace-nowrap gap-4 mb-2">
                    <h1 className="text-xs font-thin leading-6 inline-flex items-center gap-2">
                      <BiTime size={16} className="text-blue-200" />
                      <span>
                        {moment(todo.created_at).format("DD/MM/YYYY - hh:mm")}
                      </span>
                    </h1>
                    <h1 className="text-xs font-thin leading-6 inline-flex items-center gap-2">
                      <BiTimer size={20} className="text-green-200" />
                      <span className="text-orange-200">
                        {moment(todo.updated_at).format("DD/MM/YYYY - hh:mm")}
                      </span>
                    </h1>
                    {todo.isStatus === true && (
                      <h1 className="text-xs font-thin leading-6 inline-flex items-center gap-2">
                        <CgSandClock size={18} className="text-cyan-200" />
                        <span className="text-orange-200">
                          {moment(todo.updated_at).diff(
                            todo.created_at,
                            "minutes"
                          )}{" "}
                          minutes
                        </span>
                      </h1>
                    )}
                  </div>
                )}

                <p
                  className={`${
                    todo.isStatus
                      ? "italic line-through text-orange-100 dark:text-orange-100"
                      : "dark:text-white"
                  }`}
                >
                  {todo.context}
                </p>
              </th>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    todo.isStatus
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {todo.isStatus ? "Done" : "Not Done"}
                </span>
              </td>
              <td className="px-6 py-4 flex whitespace-nowrap">
                <button
                  className="font-medium hover:text-green-600 dark:hover:text-green-500 hover:underline p-2"
                  onClick={() => handleUpdateStatus(todo.id)}
                >
                  <TbArrowsExchange2 size={18} />
                </button>
                <button
                  className="font-medium hover:text-blue-600 dark:hover:text-blue-500 hover:underline p-2"
                  onClick={() => handleEdit(todo)}
                >
                  <MdOutlineModeEditOutline size={18} />
                </button>
                <button
                  className="font-medium hover:text-red-600 dark:hover:text-red-500 hover:underline p-2"
                  onClick={() => handleDelete(todo.id)}
                >
                  <MdDeleteOutline size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoTable;

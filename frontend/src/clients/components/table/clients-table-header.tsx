import { VOLUME_HEADERS } from "@clients/models/clients.model";
import { TableColGroup } from "./table-col-group";

export function ClientsTableHeader() {
  return (
    <div className="border border-surface-200 rounded-lg overflow-hidden sticky top-0 z-10">
      <table className="w-full table-fixed text-left border-separate border-spacing-0">
        <TableColGroup />
        <thead>
          <tr className="bg-black">
            <th className="p-3 font-semibold text-white">Tipo de cliente</th>
            <th className="p-2 text-xs font-semibold text-white text-center border-l border-gray-500">
              Clisse x color
            </th>
            <th className="p-2 text-xs font-semibold text-white text-center border-l border-gray-500">
              Vincular precio
            </th>
            {VOLUME_HEADERS.map((header) => (
              <th
                key={header}
                className="p-2 text-xs font-semibold text-white text-center border-l border-gray-500"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
      </table>
    </div>
  );
}

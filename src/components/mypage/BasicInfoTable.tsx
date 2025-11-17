interface BasicInfoTableProps {
  userCode?: string;
  companyName?: string;
  department?: string;
  address?: string;
  phoneNumber?: string;
  faxNumber?: string;
}

export default function BasicInfoTable({
  userCode = '0001',
  companyName = '松村商事株式会社',
  department = 'システム企画部',
  address = '東京都千代田区永田町2-13-10プルデンシャルタワー12階',
  phoneNumber = '0362058719',
  faxNumber = '0362058719',
}: BasicInfoTableProps) {
  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden">
      <table className="w-full">
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
              ユーザーコード
            </td>
            <td className="py-4 px-6 text-sm text-gray-900">
              {userCode}
            </td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
              社名
            </td>
            <td className="py-4 px-6 text-sm text-gray-900">
              {companyName}
            </td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
              部署名
            </td>
            <td className="py-4 px-6 text-sm text-gray-900">
              {department}
            </td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
              会社住所
            </td>
            <td className="py-4 px-6 text-sm text-gray-900">
              {address}
            </td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
              会社電話番号
            </td>
            <td className="py-4 px-6 text-sm text-gray-900">
              {phoneNumber}
            </td>
          </tr>
          <tr>
            <td className="py-4 px-6 bg-gray-100 text-sm text-gray-700 w-1/4">
              会社FAX番号
            </td>
            <td className="py-4 px-6 text-sm text-gray-900">
              {faxNumber}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

import SecurityHeader from "./securityHeader";
import SecurityAlert from "./securityAlert";
import SecurityForm from "./securityForm";
import type { SecurityCardProps } from "@/app/components/types/security";

export default function SecurityCard(props: SecurityCardProps) {
  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
      <SecurityHeader />

      {props.msg && (
        <SecurityAlert text={props.msg.text} type={props.msg.type} />
      )}

      <SecurityForm
        pass={props.pass}
        setPass={props.setPass}
        loading={props.loading}
        updatePassword={props.updatePassword}
      />
    </div>
  );
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { operationsScopeOptions, type OperationsScopeOption } from '@/lib/operations-scope';

function ScopeContent({ option }: { option: OperationsScopeOption }) {
  return <div className="guide-care-content">
    <div className="guide-care-heading"><h3>{option.title}</h3><p>{option.description}</p></div>
    <div className="guide-care-examples">{option.examples.map(example => <article key={example.title}>
      <h4>{example.title}</h4><p className="guide-care-request-example">{example.request}</p><p>{example.text}</p>
    </article>)}</div>
    <div className="guide-care-details">
      <div><h4>{option.costTitle}</h4><p>{option.costText}</p></div>
      <div><h4>요청할 때 이렇게 알려주세요</h4><p>{option.preparation}</p></div>
    </div>
  </div>;
}

export default function OperationsServiceScope() {
  return <div className="guide-care-scope" data-service-reveal>
    <div className="guide-care-interactive">
      <Tabs defaultValue="update" className="guide-care-tabs">
        <TabsList className="guide-care-tab-list" aria-label="필요한 운영·유지관리 작업">
          {operationsScopeOptions.map(option => <TabsTrigger className="guide-care-tab" value={option.id} key={option.id}>
            <strong>{option.label}</strong><span>{option.hint}</span>
          </TabsTrigger>)}
        </TabsList>
        {operationsScopeOptions.map(option => <TabsContent className="guide-care-panel" value={option.id} key={option.id}>
          <ScopeContent option={option}/>
        </TabsContent>)}
      </Tabs>
    </div>
    <noscript><style>{'.guide-care-interactive{display:none!important}'}</style><div className="guide-care-static">
      {operationsScopeOptions.map(option => <section key={option.id} aria-label={option.label}><ScopeContent option={option}/></section>)}
    </div></noscript>
    <p className="guide-care-help">어느 쪽인지 몰라도 괜찮습니다. 바꾸고 싶은 내용을 보내주시면 필요한 작업부터 구분해 드립니다.<br/>작업을 마치면 변경 내역과 확인할 내용을 함께 전달합니다.</p>
  </div>;
}

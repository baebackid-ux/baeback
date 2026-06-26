export default function StepTimeline({ steps }) {
  return (
    <div className="step-timeline">
      {steps.map((step, index) => (
        <div className="step-card" key={step.title}>
          <span>0{index + 1}</span>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </div>
      ))}
    </div>
  );
}

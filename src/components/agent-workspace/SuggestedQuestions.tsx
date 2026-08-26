import styles from './SuggestedQuestions.module.css';

// Read-only for this phase per spec section 16 (no copy button).
export function SuggestedQuestions({ questions }: { questions: string[] }) {
  return (
    <ul className={styles.list}>
      {questions.map((question) => (
        <li key={question} className={styles.item}>
          {question}
        </li>
      ))}
    </ul>
  );
}

const Quadrant = ({title, tasks}) => {
  return (
    <div className="quadrant-box">
      <h3>{title}</h3>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.text}</li>
        ))}
      </ul>
    </div>
  )
}

export default Quadrant
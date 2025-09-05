import "./styles.css";

const TopPerformers = () => {
  return (
    <table className="performers-table">
      <tbody className="performers-table-body">
        <tr className="performers-table-tr">
          <th scope="row">1</th>
          <td>Mark</td>
          <td>
            <span className="pts">7000 pts</span>
          </td>
        </tr>
        <tr className="performers-table-tr">
          <th scope="row">2</th>
          <td>Jacob</td>
          <td>
            <span className="pts">7000 pts</span>
          </td>
        </tr>
        <tr className="performers-table-tr">
          <th scope="row">3</th>
          <td>Larry</td>
          <td>
            <span className="pts">7000 pts</span>
          </td>
        </tr>

        <tr className="performers-table-tr">
          <th scope="row">4</th>
          <td>Larry</td>
          <td>
            <span className="pts">7000 pts</span>
          </td>
        </tr>

        <tr className="performers-table-tr">
          <th scope="row">5</th>
          <td>Larry</td>
          <td>
            <span className="pts">7000 pts</span>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TopPerformers;

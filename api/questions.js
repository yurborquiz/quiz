module.exports = (req, res) => {
  if (req.method === 'GET') {
    res.status(200).json({
      questions_copy: [
        {
          id: 1,
          question: "A Nexus with five Scrum Teams has been created to build one product. Who has to coordinate the work with other teams in the Nexus?",
          type: "RADIO",
          options: [
            { id: 1, text: "Nexus Integration Team, because they are responsible for cross-team dependencies", correct: false },
            { id: 2, text: "Scrum Master should teach the Developers that it is their responsibility to work with other teams", correct: true },
            { id: 3, text: "Lead Developer on a Team should coordinate with other teams", correct: false },
            { id: 4, text: "Product Owner", correct: false }
          ],
          isRequired: true
        },
        // Другие вопросы...
      ]
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

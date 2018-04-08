class CandidateSerializer < CandidateSmallSerializer
  attributes :experience,
    :education,
    :skills,
    :description

  has_one :recruiter


  def root_message_id
    return nil # FIXME

    m = Message.threads_for_candidate(object).first
    m ? m.hashid : nil
  end

  def description
    m = Message.threads_for_candidate(object).first
    m ? m.body : ""
  end

  def education
    [ 
      { 
        school: "University of Illinois", 
        year_start: "2000",
        year_end: "2004",
        degree: "BS Mathematics/Computer Science"
      },
      { school: "Stanford",
        year_start: "2005",
        year_end: "2009",
        degree: "MS CS"
      }
    ]
  end

  def experience
    [ 
      { 
        organization: "Yahoo, Inc",
        year_start: "2011",
        year_end: "2014",
        title: "Jr. Yahoo!",
        description: "Worked on web logs for the Yahoo! Mail team",
      },
      { 
        organization: "Google, Inc",
        year_start: "2014",
        year_end: "2016",
        title: "Software Engineer",
        description: "Worked on web logs for the Yahoo! Mail team",
      },
      { 
        organization: "Bobco Startup",
        year_start: "2016",
        year_end: nil,
        title: "Sr. Software Engineer",
        description: "Worked on web logs for the Yahoo! Mail team",
      },
    ]
  end

  def skills
    [ 
      "C",
      "C++",
      "Javascript",
      "HTML",
      "AI",
      "Machine Learning",
      "Payment Processing",
    ]
  end
end

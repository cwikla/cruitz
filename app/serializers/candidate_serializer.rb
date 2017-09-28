class CandidateSerializer < ActiveModel::Serializer
  attributes :id,
    :first_name,
    :last_name,
    :phone_number,
    :email,
    :description,
    :job_id,
    :root_message_id,
    :state,
    :experience,
    :education,
    :skills

  has_one :recruiter, through: :head, class_name: 'User'

  def id
    object.hashid
  end

  def job_id
    object.job_id ? object.job.hashid : nil
  end

  def first_name
    object.head.first_name
  end

  def last_name
    object.head.last_name
  end

  def phone_number
    object.head.phone_number
  end

  def email
    object.head.email
  end

  def root_message_id
    m = Message.thread_for_candidate(object).first
    m ? m.hashid : nil
  end

  def description
    m = Message.thread_for_candidate(object).first
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

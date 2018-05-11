class SetupCandidateMessage < ActiveRecord::Migration[5.1]
  def new_message(c)
    Message.create(
      job_id: c.job_id,
      candidate_id: c.id,
      user_id: c.hirer.id,
      from_user_id: c.recruiter.id,
      body: "New candidate #{c.head.full_name}"
    )
  end

  def up
    Candidate.find_each do |c|
      puts "#{c.id}"
      message = Message.threads_for_candidate(c).first
      message ||= new_message(c)
      puts message.inspect
      c.description_id = message.id
      c.save!
    end
  end

  def down
    # nothing to see here
  end
end

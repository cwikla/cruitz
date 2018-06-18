class CandidateNotifyJob < Pyr::Async::BaseJob

  def self.notify(candidate)
    self.push(candidate_id: candidate.id)
  end

  def self.perform(msg)
    candidate_id = msg["candidate_id"]
    return if candidate_id.blank?

    candy = Candidate.find_safe(candidate_id)
    return if candy.nil?

    hirer = candy.hirer
    recruiter = candy.recruiter

    hirer_result = CandidateSerializer.new(candy, current_user: hirer).as_json
    recruiter_result = CandidateSerializer.new(candy, current_user: recruiter).as_json

    User::pusher_batch([
      { channel: hirer.pusher_private_channel, name: "candidates-update", data: { candidate: hirer_result} },
      { channel: hirer.pusher_private_channel, name: "candidate-#{candy.id}", data: { candidate: hirer_result } },

      { channel: recruiter.pusher_private_channel, name: "candidates-update", data: { candidate: recruiter_result} },
      { channel: recruiter.pusher_private_channel, name: "candidate-#{candy.id}", data: { candidate: recruiter_result } }
    ])
  end

end

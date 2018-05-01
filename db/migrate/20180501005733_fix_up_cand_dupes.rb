class FixUpCandDupes < ActiveRecord::Migration[5.1]
  def up
    Candidate.with_deleted.update_all(deleted_at: nil)

    Candidate.order("-id").all.each do |candy|
      jid = candy.job_id
      hid = candy.head_id

      puts "Working on #{candy.id}"
      Candidate.where(job_id: jid).where(head_id: hid).where("id < ?", candy.id).all.each do |x|
        x.really_destroy!
      end
    end
  end

  def down
    # nothing to see here
  end
end

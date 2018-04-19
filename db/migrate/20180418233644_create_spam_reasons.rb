class CreateSpamReasons < ActiveRecord::Migration[5.1]

  REASONS = [
    "Bad candidates",
    "Inappropriate message",
    "Not a recruiter",
    "Generally Annoying",
    "Other"
  ]

  def up
    create_table :spam_reasons do |t|
      t.timestamps
      t.timestamp :deleted_at
      t.string :title, null: false
    end

    REASONS.each do |x|
      SpamReason.create!(title: x)
    end
  end

  def down
    drop_table :spam_reasons
  end
end

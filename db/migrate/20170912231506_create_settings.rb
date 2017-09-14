class CreateSettings < ActiveRecord::Migration[5.1]
  def change
    create_table :settings do |t|
      t.timestamps
      t.timestamp :deleted_at
      t.string :uuid, :limit => 36

      t.integer :user_id, :null => false

      t.boolean :use_ignore_recruiters, :default => true, :null => false
      t.integer :minimum_recruiter_score, :null => false

      t.boolean :use_ignore_agencies, :default => true, :null => false
      t.integer :minimum_agency_score, :null => false

      t.boolean :use_reject_candidates, :default => true, :null => false
      t.integer :reject_candidate_days, :null => false

      t.boolean :use_auto_spam, :default => true, :null => false
      
      t.boolean :use_ban_recruiter, :default => true, :null => false
      t.integer :ban_recruiter_days, :null => false

      t.boolean :use_ban_agency, :default => true, :null => false
      t.integer :ban_agency_days, :null => false

      t.boolean :use_recruiter_limit, :default => true, :null => false
      t.integer :recruiter_limit, :null => false

      t.boolean :use_agency_limit, :default => true, :null => false
      t.integer :agency_limit, :null => false
    end

    add_index :settings, :user_id, :unique => true
    add_index :settings, :uuid, :unique => true

  end
end

class CreateRecruiters < ActiveRecord::Migration[5.0]
  def change
    create_table :recruiters do |t|
      t.timestamps
      t.timestamp :deletd_at

      t.integer :user_id
      t.integer :agency_id
    end

    add_index :recruiters, [:agency_id, :user_id]
  end
end

class CreateCandidateUploads < ActiveRecord::Migration[5.1]
  def change
    create_table :candidate_uploads do |t|
      t.timestamps
      t.timestamp :deleted_at
      t.integer :candidate_id, null: false
      t.integer :pyr_upload_id, null: false
    end

    add_index :candidate_uploads, [:candidate_id, :pyr_upload_id]
  end
end

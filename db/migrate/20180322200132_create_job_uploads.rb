class CreateJobUploads < ActiveRecord::Migration[5.1]
  def change
    create_table :job_uploads do |t|
      t.timestamps
      t.timestamp :deleted_at
      t.integer :job_id, null: false
      t.integer :pyr_upload_id, null: false
    end

    add_index :job_uploads, [:job_id, :pyr_upload_id]
  end
end

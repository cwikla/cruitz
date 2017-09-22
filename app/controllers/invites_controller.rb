class InvitesController < ApplicationController

  def new
    render json: Invite.new
  end

  def create
    @invite = current_user.invites.build(invite_params)
    if @invite.save
      return render json: @invite
    else
      puts "ERROR: #{@invite.errors.inspect}"
      return render_create_error json: @invite
    end
  end

  private

  def invite_params
    params.require(:invite).permit(:first_name, :last_name, :email, :body, :use_default)
  end

end
